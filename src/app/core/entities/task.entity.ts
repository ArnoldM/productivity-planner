export type PomodoroStatus = 'Not started' | 'In progress' | 'Done';
export const TASK_TYPES = ['Hit the target', 'Get things done'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const POMODORO_COUNTS = [1, 2, 3, 4, 5] as const;
export type PomodoroCount = (typeof POMODORO_COUNTS)[number];

export class Task {
  readonly type: TaskType;
  readonly #title: string;
  readonly #pomodoroCount: PomodoroCount;
  readonly #pomodoroList: readonly PomodoroStatus[];

  private constructor(
    type: TaskType,
    title: string,
    pomodoroCount: PomodoroCount,
    pomodoroList?: PomodoroStatus[],
  ) {
    if (!TASK_TYPES.includes(type)) {
      throw new Error('Invalid task type');
    }

    if (!title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    if (pomodoroList && pomodoroList.length !== pomodoroCount) {
      throw new Error(
        `Pomodoro list length(${pomodoroList.length}) must match pomodoro count (${pomodoroCount})`,
      );
    }

    this.type = type;
    this.#title = title;
    this.#pomodoroCount = pomodoroCount;
    this.#pomodoroList =
      pomodoroList?.slice() ?? Array.from({ length: pomodoroCount }, () => 'Not started');
  }

  static createEmptyTask(): Task {
    return new Task('Hit the target', 'Nouvelle tâche', 1, ['Not started']);
  }

  static create(
    type: TaskType,
    title: string,
    pomodoroCount: PomodoroCount,
    pomodoroList?: PomodoroStatus[],
  ): Task {
    return new Task(type, title, pomodoroCount, pomodoroList);
  }

  get title(): string {
    return this.#title;
  }

  get pomodoroCount(): PomodoroCount {
    return this.#pomodoroCount;
  }

  get pomodoroList(): readonly PomodoroStatus[] {
    return this.#pomodoroList;
  }

  withType(newType: TaskType): Task {
    return new Task(newType, this.#title, this.#pomodoroCount, [...this.#pomodoroList]);
  }

  withTitle(newTitle: string): Task {
    return new Task(this.type, newTitle, this.#pomodoroCount, [...this.#pomodoroList]);
  }

  withPomodoroStatus(index: number, status: PomodoroStatus): Task {
    if (index < 0 || index >= this.#pomodoroList.length) {
      throw new Error('Invalid pomodoro index');
    }
    const newPomodoroList = this.#pomodoroList.map((s, i) => (i === index ? status : s));
    return new Task(this.type, this.#title, this.#pomodoroCount, newPomodoroList);
  }

  withPomodoroCount(newCount: PomodoroCount): Task {
    if (newCount === this.#pomodoroCount) {
      return this;
    }

    const newPomodoroList = Array.from(
      { length: newCount },
      (_, i) => this.#pomodoroList[i] ?? 'Not started',
    );
    return new Task(this.type, this.#title, newCount, newPomodoroList);
  }

  isEmpty(): boolean {
    return this.#title === 'Nouvelle tâche';
  }
}
