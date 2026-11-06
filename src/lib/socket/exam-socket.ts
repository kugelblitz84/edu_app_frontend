export type ExamSocketListener = (payload: unknown) => void;

export class ExamSocketSimulator {
  private attemptId: string | null = null;
  private listeners: Map<string, Set<ExamSocketListener>> = new Map();
  public isConnected: boolean = false;
  private revision: number = 0;

  constructor() {
    this.isConnected = true;
  }

  public connect() {
    this.isConnected = true;
    this.trigger('connect', { connected: true, timestamp: Date.now() });
  }

  public disconnect() {
    this.isConnected = false;
    this.trigger('disconnect', { reason: 'client_disconnect' });
  }

  public on(event: string, callback: ExamSocketListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public emit(event: string, data: Record<string, unknown>) {
    if (event === 'attempt.join') {
      this.attemptId = (data.attemptId as string) || null;
      setTimeout(() => {
        this.trigger('attempt.joined', {
          attemptId: data.attemptId,
          status: 'IN_PROGRESS',
          serverTime: Date.now()
        });
      }, 100);
      return;
    }

    if (event === 'answer.save') {
      this.revision += 1;
      const currentRev = this.revision;
      setTimeout(() => {
        this.trigger('answer.ack', {
          attemptId: data.attemptId,
          questionId: data.questionId,
          revision: currentRev,
          savedAt: new Date().toISOString()
        });
      }, 150);
      return;
    }
  }

  private trigger(event: string, payload: unknown) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => fn(payload));
    }
  }

  public getAttemptId(): string | null {
    return this.attemptId;
  }
}

export const examSocket = new ExamSocketSimulator();
