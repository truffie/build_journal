/**
 * Immutable snapshot of executor (worker/brigadier) at entry creation time.
 */
export class WorkerSnapshot {
  readonly workerId: string | null;
  readonly name: string;

  private constructor(workerId: string | null, name: string) {
    this.workerId = workerId;
    this.name = name;
  }

  static fromName(name: string): WorkerSnapshot {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Invalid worker snapshot');
    }
    return new WorkerSnapshot(null, trimmedName);
  }

  static fromWorker(workerId: string, name: string): WorkerSnapshot {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Invalid worker snapshot');
    }
    return new WorkerSnapshot(workerId, trimmedName);
  }

  toPersistence(): { workerId: string | null; workerNameSnapshot: string } {
    return {
      workerId: this.workerId,
      workerNameSnapshot: this.name,
    };
  }
}
