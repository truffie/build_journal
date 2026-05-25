/**
 * Immutable snapshot of work type at entry creation time.
 */
export class WorkTypeSnapshot {
  readonly name: string;
  readonly unit: string;

  constructor(name: string, unit: string) {
    const trimmedName = name.trim();
    const trimmedUnit = unit.trim();
    if (!trimmedName || !trimmedUnit) {
      throw new Error('Invalid work type snapshot');
    }
    this.name = trimmedName;
    this.unit = trimmedUnit;
  }

  static fromStrings(name: string, unit: string): WorkTypeSnapshot {
    return new WorkTypeSnapshot(name, unit);
  }

  toPersistence(): { workTypeSnapshot: string; unitSnapshot: string } {
    return {
      workTypeSnapshot: this.name,
      unitSnapshot: this.unit,
    };
  }

  toString(): string {
    return `${this.name} (${this.unit})`;
  }
}
