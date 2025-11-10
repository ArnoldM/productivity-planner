import { Task } from '@core/entities/task.entity';

export class Workday {
  readonly date: string;
  readonly #MAX_TASKS_LIMIT = 6;
  readonly #taskList: Task[];

  private constructor(date: string | Date, taskList: Task[]) {
    const isoDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(isoDate.getTime())) {
      throw new Error('Invalid date format.');
    }

    if (taskList.length > this.#MAX_TASKS_LIMIT) {
      throw new Error(`Task list cannot contain more than ${this.#MAX_TASKS_LIMIT} tasks.`);
    }

    this.date = isoDate.toISOString().split('T')[0];
    this.#taskList = [...taskList];
  }

  static createEmptyWorkday(): Workday {
    return new Workday(new Date(), []);
  }

  static create(date: string | Date, taskList: Task[]): Workday {
    return new Workday(date, taskList);
  }

  get taskList(): readonly Task[] {
    return this.#taskList;
  }

  withDate(date: string) {
    return new Workday(date, this.#taskList);
  }

  addEmptyTask(): Workday {
    const task = Task.createEmptyTask();
    return this.addTask(task);
  }

  addTask(task: Task): Workday {
    if (this.#taskList.length >= this.#MAX_TASKS_LIMIT) {
      throw new Error(`Cannot add more than ${this.#MAX_TASKS_LIMIT} tasks to a workday.`);
    }
    const newTaskList = [...this.#taskList, task];
    return new Workday(this.date, newTaskList);
  }

  removeTask(index: number): Workday {
    if (index < 0 || index >= this.#taskList.length) {
      throw new Error('Invalid task index.');
    }

    const newTaskList = this.#taskList.toSpliced(index, 1);
    return new Workday(this.date, newTaskList);
  }

  replaceTask(index: number, newTask: Task): Workday {
    if (index < 0 || index >= this.#taskList.length) {
      throw new Error('Invalid task index.');
    }
    const newTaskList = this.#taskList.map((task, i) => (i === index ? newTask : task));
    return new Workday(this.date, newTaskList);
  }

  isTaskListFull() {
    return this.#taskList.length >= this.#MAX_TASKS_LIMIT;
  }

  hasNoPlannedTasks(): boolean {
    return this.#taskList.length === 0;
  }
}
