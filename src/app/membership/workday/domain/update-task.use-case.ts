import { Injectable } from '@angular/core';
import { TaskType, PomodoroStatus, PomodoroCount } from '../../../core/entities/task.entity';
import { Workday } from '@core/entities/workday.entity';

export interface TaskUpdates {
  type?: TaskType;
  title?: string;
  pomodoroCount?: PomodoroCount;
  pomodoroStatusAtIndex?: { index: number; status: PomodoroStatus };
}

@Injectable()
export class UpdateTaskUseCase {
  execute(workday: Workday, taskIndex: number, updates: TaskUpdates): Workday {
    const task = workday.taskList[taskIndex];

    if (!task) {
      throw new Error('Invalid task index.');
    }

    let newTask = task;

    if (updates.type !== undefined) {
      newTask = newTask.withType(updates.type);
    }
    if (updates.title !== undefined) {
      newTask = newTask.withTitle(updates.title);
    }
    if (updates.pomodoroCount !== undefined) {
      newTask = newTask.withPomodoroCount(updates.pomodoroCount);
    }
    if (updates.pomodoroStatusAtIndex !== undefined) {
      newTask = newTask.withPomodoroStatus(
        updates.pomodoroStatusAtIndex.index,
        updates.pomodoroStatusAtIndex.status,
      );
    }

    return workday.replaceTask(taskIndex, newTask);
  }
}
