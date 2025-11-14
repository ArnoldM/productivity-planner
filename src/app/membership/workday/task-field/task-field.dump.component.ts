import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { POMODORO_COUNTS, Task } from '@core/entities/task.entity';
import { TaskUpdates } from '../domain/update-task.use-case';

@Component({
  selector: 'app-task-field',
  imports: [FormsModule],
  templateUrl: './task-field.dump.component.html',
  styleUrl: './task-field.dump.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card p-3 d-flex flex-row align-items-center justify-content-between',
    'data-testid': 'task-card',
  },
})
export class TaskFieldDumpComponent {
  readonly pomodoroOptions = POMODORO_COUNTS;
  readonly task = input.required<Task>();
  readonly taskUpdated = output<TaskUpdates>();
  readonly taskRemoved = output<void>();
}
