import { Injectable } from '@angular/core';
import { Workday } from '@core/entities/workday.entity';
import { Task } from '@core/entities/task.entity';

@Injectable()
export class AddTaskUseCase {
  execute(workday: Workday, task?: Task): Workday {
    if (task) {
      return workday.addTask(task);
    }
    return workday.addEmptyTask();
  }
}
