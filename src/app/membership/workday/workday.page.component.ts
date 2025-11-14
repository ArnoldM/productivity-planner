import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { POMODORO_COUNTS, TaskType } from '@core/entities/task.entity';
import { WorkdayPageStore, WorkdayPageStoreType } from '@membership/workday/workday.page.store';
import { EmptyWorkdayDumbComponent } from '@membership/workday/empty-workday/empty-workday.dumb.component';

@Component({
  selector: 'app-workday',
  imports: [FormsModule, EmptyWorkdayDumbComponent],
  templateUrl: './workday.page.component.html',
  styleUrl: './workday.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-workday w-100',
  },
  providers: [WorkdayPageStore],
})
export default class WorkdayPageComponent {
  readonly localStore: WorkdayPageStoreType = inject(WorkdayPageStore);
  readonly pomodoroOptions = POMODORO_COUNTS;
  selectedOption: TaskType = 'Hit the target';
  selectedDate = new Date().toISOString().split('T')[0];
}
