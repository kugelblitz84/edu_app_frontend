'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { FULL_EXAMS } from '@/data';
import { Exam, ExamAnswer, ExamResult } from '@/types';
import {
  ExamTimer,
  QuestionPalette,
  QuestionCard,
  ExamRecoveryBanner,
  ExamResultScorecard
} from '@/components/exams';
import { examSocket } from '@/lib/socket/exam-socket';
import { useCountdown } from '@/hooks/useCountdown';
import {
  ShieldCheck,
  Maximize2,
  Minimize2,
  ArrowLeft,
  AlertTriangle,
  X
} from 'lucide-react';

function LiveExamArenaContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Look up full exam definition
  const exam: Exam = FULL_EXAMS[id] || FULL_EXAMS['exam-1'];

  // Storage key for crash recovery
  const storageKey = `witbase_exam_attempt_${exam.id}`;

  const [attemptId] = useState<string>(() => `att-${exam.id}`);
  const [answers, setAnswers] = useState<Record<string, ExamAnswer>>(() => {
    if (typeof window !== 'undefined') {
      const savedBuffer = localStorage.getItem(`witbase_exam_attempt_${exam.id}`);
      if (savedBuffer) {
        try {
          const parsed = JSON.parse(savedBuffer);
          if (parsed.answers && Object.keys(parsed.answers).length > 0) {
            return parsed.answers;
          }
        } catch {
          // ignore corrupted buffer
        }
      }
    }
    return {};
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline] = useState(true);
  const [wasRecovered] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedBuffer = localStorage.getItem(`witbase_exam_attempt_${exam.id}`);
      if (savedBuffer) {
        try {
          const parsed = JSON.parse(savedBuffer);
          return Boolean(parsed.answers && Object.keys(parsed.answers).length > 0);
        } catch {
          return false;
        }
      }
    }
    return false;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Crash Recovery & Socket listener setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Connect exam live socket
      examSocket.connect();
      examSocket.emit('attempt.join', { attemptId: `att-${exam.id}` });

      const unsubscribeAck = examSocket.on('answer.ack', () => {
        setIsSaving(false);
      });

      return () => {
        unsubscribeAck();
        examSocket.disconnect();
      };
    }
  }, [exam.id]);

  // Autosave persistence helper
  const persistAnswers = (updated: Record<string, ExamAnswer>, questionId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          attemptId,
          examId: exam.id,
          answers: updated,
          updatedAt: Date.now()
        })
      );
    }

    // Trigger realtime debounced websocket sync
    setIsSaving(true);
    examSocket.emit('answer.save', {
      attemptId,
      questionId,
      answer: updated[questionId],
      revision: Date.now()
    });
  };

  // Timer: 45 minutes default or per exam definition
  const totalDurationSeconds = exam.durationMinutes * 60;
  const { secondsLeft, formatted, isUrgent } = useCountdown({
    initialSeconds: totalDurationSeconds,
    onExpire: () => {
      handleFinalSubmission();
    }
  });

  // Handle Option Selection
  const handleSelectOption = (optionId: string) => {
    const currentQ = exam.questions[currentIndex];
    const prevAnswer = answers[currentQ.id];

    // Single choice selection
    const updatedAnswer: ExamAnswer = {
      questionId: currentQ.id,
      selectedOptionIds: [optionId],
      isFlagged: prevAnswer?.isFlagged || false,
      savedAt: new Date().toISOString()
    };

    const newAnswers = { ...answers, [currentQ.id]: updatedAnswer };
    setAnswers(newAnswers);
    persistAnswers(newAnswers, currentQ.id);
  };

  // Clear answer
  const handleClearAnswer = () => {
    const currentQ = exam.questions[currentIndex];
    const prevAnswer = answers[currentQ.id];
    if (!prevAnswer) return;

    const updatedAnswer: ExamAnswer = {
      ...prevAnswer,
      selectedOptionIds: []
    };

    const newAnswers = { ...answers, [currentQ.id]: updatedAnswer };
    setAnswers(newAnswers);
    persistAnswers(newAnswers, currentQ.id);
  };

  // Toggle Flag
  const handleToggleFlag = () => {
    const currentQ = exam.questions[currentIndex];
    const prevAnswer = answers[currentQ.id] || {
      questionId: currentQ.id,
      selectedOptionIds: [],
      isFlagged: false
    };

    const updatedAnswer: ExamAnswer = {
      ...prevAnswer,
      isFlagged: !prevAnswer.isFlagged
    };

    const newAnswers = { ...answers, [currentQ.id]: updatedAnswer };
    setAnswers(newAnswers);
    persistAnswers(newAnswers, currentQ.id);
  };

  // Final submission grading logic
  const handleFinalSubmission = () => {
    setShowSubmitConfirm(false);

    // Calculate score
    let earnedScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const breakdown = exam.questions.map((q) => {
      const userChoice = answers[q.id]?.selectedOptionIds || [];
      const correctChoice = q.correctOptionIds || [];

      const isAnswered = userChoice.length > 0;
      const isCorrect =
        isAnswered &&
        userChoice.length === correctChoice.length &&
        userChoice.every((id) => correctChoice.includes(id));

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        earnedScore += q.marks;
      } else {
        wrongCount++;
      }

      return {
        questionId: q.id,
        text: q.text,
        options: q.options,
        userSelectedIds: userChoice,
        correctOptionIds: correctChoice,
        isCorrect,
        earnedMarks: isCorrect ? q.marks : 0,
        maxMarks: q.marks,
        explanation: q.explanation || 'Verified syllabus answer.'
      };
    });

    const percentage = (earnedScore / exam.totalMarks) * 100;
    const isPassed = percentage >= exam.passPercentage;

    const result: ExamResult = {
      attemptId,
      examId: exam.id,
      examTitle: exam.title,
      totalQuestions: exam.questions.length,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      unansweredCount,
      score: earnedScore,
      maxScore: exam.totalMarks,
      percentage,
      isPassed,
      passPercentage: exam.passPercentage,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: totalDurationSeconds - secondsLeft,
      breakdown
    };

    // Clean up local recovery buffer
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }

    setExamResult(result);
    setIsFinalized(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] text-white flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Distraction-Free Proctored Top Navigation */}
      <header className="bg-[#181722] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/exams"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Exit Exam Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {exam.title}
              </h1>
              {exam.isProctored && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Proctored
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {exam.institutionName || 'WitBase Academic Grid'}
            </p>
          </div>
        </div>

        {/* Live Status & Countdown Timer */}
        <div className="flex items-center gap-3">
          {!isFinalized && (
            <>
              <ExamRecoveryBanner
                isSaving={isSaving}
                isOnline={isOnline}
                wasRecovered={wasRecovered}
              />

              <ExamTimer
                formatted={formatted}
                isUrgent={isUrgent}
              />
            </>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white cursor-pointer transition-colors hidden sm:block"
            title="Toggle Distraction-Free Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Arena Body */}
      <main className="flex-1 p-3 sm:p-6 2xl:p-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {isFinalized && examResult ? (
          <ExamResultScorecard
            result={examResult}
            onRetake={() => {
              setAnswers({});
              setIsFinalized(false);
              setExamResult(null);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch flex-1">
            {/* Question Card (3 cols) */}
            <div className="lg:col-span-3 h-full">
              <QuestionCard
                question={exam.questions[currentIndex]}
                index={currentIndex}
                totalQuestions={exam.questions.length}
                answer={answers[exam.questions[currentIndex].id]}
                onSelectOption={handleSelectOption}
                onToggleFlag={handleToggleFlag}
                onClearAnswer={handleClearAnswer}
                onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                onNext={() =>
                  setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))
                }
                hasPrev={currentIndex > 0}
                hasNext={currentIndex < exam.questions.length - 1}
              />
            </div>

            {/* Question Palette (1 col) */}
            <div className="lg:col-span-1 h-full">
              <QuestionPalette
                questions={exam.questions}
                currentIndex={currentIndex}
                answers={answers}
                onSelectIndex={setCurrentIndex}
                onSubmitExam={() => setShowSubmitConfirm(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="wb-modal-backdrop animate-in fade-in duration-150">
          <div className="wb-modal-card max-w-md bg-[#181722] text-white border-white/15">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Submit Examination?</h3>
                  <p className="text-xs text-zinc-400">
                    Are you sure you want to finalize your assessment?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Answered Questions:</span>
                <span className="font-bold text-emerald-400">
                  {
                    Object.values(answers).filter(
                      (a) => a.selectedOptionIds && a.selectedOptionIds.length > 0
                    ).length
                  }{' '}
                  / {exam.questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Remaining Unanswered:</span>
                <span className="font-bold text-amber-400">
                  {exam.questions.length -
                    Object.values(answers).filter(
                      (a) => a.selectedOptionIds && a.selectedOptionIds.length > 0
                    ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Time Left on Timer:</span>
                <span className="font-mono text-purple-300">{formatted}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              Once submitted, you will immediately receive your graded scorecard, score percentage, and comprehensive answer breakdown.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-zinc-300"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={handleFinalSubmission}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#6219BD] hover:bg-[#5214A0] text-white shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                Yes, Finalize &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveExamArenaPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0E17] text-white flex items-center justify-center text-xs">Connecting to secure proctored exam arena...</div>}>
      <LiveExamArenaContent params={params} />
    </Suspense>
  );
}
