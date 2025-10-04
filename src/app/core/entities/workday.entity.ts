import { Task } from '@core/entities/task.entity';

export class Workday {
  readonly date: string;
  readonly #MAX_TASKS_LIMIT = 6;
  #taskList: Task[];

  private constructor(date: string | Date, taskList: Task[]) {
    const isoDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(isoDate.getTime())) {
      throw new Error('Invalid date format.');
    }

    if (taskList.length < 1 || taskList.length > this.#MAX_TASKS_LIMIT) {
      throw new Error(`Task list must contain between 1 and ${this.#MAX_TASKS_LIMIT} tasks.`);
    }

    this.date = isoDate.toISOString().split('T')[0];
    this.#taskList = [...taskList];
  }

  static createEmptyWorkday(): Workday {
    return new Workday(new Date(), [Task.createEmptyTask()]);
  }

  get taskList(): Task[] {
    return this.#taskList;
  }

  addEmptyTask() {
    const task = Task.createEmptyTask();
    this.addTask(task);
  }

  addTask(task: Task) {
    if (this.#taskList.length >= this.#MAX_TASKS_LIMIT) {
      throw new Error(`Cannot add more than ${this.#MAX_TASKS_LIMIT} tasks to a workday.`);
    }
    this.#taskList = [...this.#taskList, task];
  }

  removeTask(index: number) {
    if (this.#taskList.length === 1) {
      throw new Error('A workday must have at least one task.');
    }

    if (index < 0 || index > this.#taskList.length) {
      throw new Error('Invalid task index.');
    }

    this.#taskList = this.#taskList.filter((_, i) => i !== index);
  }

  replaceTask(index: number, newTask: Task) {
    if (index < 0 || index >= this.#taskList.length) {
      throw new Error('Invalid task index.');
    }
    this.#taskList = this.#taskList.map((task, i) => (i === index ? newTask : task));
  }
}
