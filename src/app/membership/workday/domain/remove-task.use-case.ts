import { Injectable } from '@angular/core';
import { Workday } from '@core/entities/workday.entity';

@Injectable()
export class RemoveTaskUseCase {
  execute(workday: Workday, taskIndex: number): Workday {
    return workday.removeTask(taskIndex);
  }
}
