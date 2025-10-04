import { Task } from '@core/entities/task.entity';

export class Workday {
  readonly date: string;
  #taskList: Task[];

  private constructor(date: string | Date, taskList: Task[]) {
    const isoDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(isoDate.getTime())) {
      throw new Error('Invalid date format.');
    }

    // if (taskList.length < 1 || taskList.length > 6) {
    //   throw new Error('Task list must contain between 1 and 6 tasks.');
    // }

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
    if (this.#taskList.length >= 6) {
      throw new Error('Cannot add more than 6 tasks to a workday.');
    }
    this.#taskList.push(task);
  }

  removeTask(index: number) {
    if (this.#taskList.length === 1) {
      throw new Error('A workday must have at least one task.');
    }

    if (index < 0 || index > this.#taskList.length) {
      throw new Error('Invalid task index.');
    }

    this.#taskList.splice(index, 1);
  }

  replaceTask(index: number, newTask: Task) {
    if (index < 0 || index > this.#taskList.length) {
      throw new Error('Invalid task index.');
    }
    this.#taskList[index] = newTask;
  }
}
