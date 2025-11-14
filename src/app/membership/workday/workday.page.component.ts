import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskType } from '@core/entities/task.entity';
import { WorkdayPageStore, WorkdayPageStoreType } from '@membership/workday/workday.page.store';
import { TaskFieldDumpComponent } from './task-field/task-field.dump.component';
import { EmptyWorkdayDumbComponent } from './empty-workday/empty-workday.dumb.component';

@Component({
  selector: 'app-workday',
  imports: [FormsModule, TaskFieldDumpComponent, EmptyWorkdayDumbComponent],
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
  selectedOption: TaskType = 'Hit the target';
  selectedDate = new Date().toISOString().split('T')[0];
}
