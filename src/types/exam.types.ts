export interface UpcomingExamItem {
  id: string;
  title: string;
  timeRemaining: string;
  visibility: 'Public' | 'Private' | string;
  category?: string;
  startsAt?: string;
  closesAt?: string;
  totalMarks?: number;
  durationMinutes?: number;
  questionCount?: number;
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: ExamOption[];
  marks: number;
  explanation?: string;
  correctOptionIds?: string[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  passPercentage: number;
  totalMarks: number;
  visibility: 'Public' | 'Private';
  startsAt: string;
  closesAt: string;
  institutionName?: string;
  questions: ExamQuestion[];
  instructions?: string[];
  isProctored?: boolean;
}

export interface ExamAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isFlagged?: boolean;
  savedAt?: string;
  revision?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  startedAt: string;
  expiresAt: string;
  durationSeconds: number;
  remainingSeconds: number;
  answers: Record<string, ExamAnswer>;
  submitted: boolean;
  score?: number;
}

export interface QuestionResultBreakdown {
  questionId: string;
  text: string;
  options: ExamOption[];
  userSelectedIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  earnedMarks: number;
  maxMarks: number;
  explanation: string;
}

export interface ExamResult {
  attemptId: string;
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  passPercentage: number;
  completedAt: string;
  timeSpentSeconds: number;
  breakdown: QuestionResultBreakdown[];
}

export interface ExamHistoryItem {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  date: string;
  durationMinutes: number;
}
