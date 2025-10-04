import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkdayPageStore, WorkdayPageStoreType } from '@membership/workday/workday.page.store';

@Component({
  selector: 'app-workday',
  imports: [FormsModule],
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

  selectedOption = '⛳️';
  selectedDate = '2019-02-28';
}
