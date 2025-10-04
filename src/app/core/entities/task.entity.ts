type PomodoroStatus = 'Not started' | 'In progress' | 'Done';
type TaskType = 'Hit the target' | 'Get things done';
type PomodoroCount = 1 | 2 | 3 | 4 | 5;

export class Task {
  readonly type: TaskType;
  #title: string;
  #pomodoroCount: PomodoroCount;
  #pomodoroList: PomodoroStatus[];

  private constructor(
    type: TaskType,
    title: string,
    pomodoroCount: PomodoroCount,
    pomodoroList?: PomodoroStatus[],
  ) {
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

  get title(): string {
    return this.#title;
  }

  get pomodoroCount(): 1 | 2 | 3 | 4 | 5 {
    return this.#pomodoroCount;
  }

  get pomodoroList(): PomodoroStatus[] {
    return this.#pomodoroList;
  }

  updateTitle(newTitle: string): void {
    if (!newTitle.trim()) {
      throw new Error('Task title cannot be empty');
    }
    this.#title = newTitle;
  }

  updatePomodoroStatus(index: number, status: PomodoroStatus): void {
    if (index < 0 || index >= this.#pomodoroList.length) {
      throw new Error('Invalid pomodoro index');
    }
    this.#pomodoroList[index] = status;
  }

  updatePomodoroCount(newCount: PomodoroCount) {
    if (newCount === this.#pomodoroCount) return;

    this.#pomodoroList = Array.from(
      { length: newCount },
      (_, i) => this.#pomodoroList[i] ?? 'Not started',
    );
  }
}
