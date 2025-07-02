import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkdayPageStore, WorkdayPageStoreType } from '@membership/workday/workday.page.store';

@Component({
  selector: 'app-workday',
  imports: [FormsModule],
  templateUrl: './workday.page.component.html',
  styleUrl: './workday.page.component.scss',
  host: {
    class: 'app-workday w-100',
  },
  providers: [WorkdayPageStore],
})
export default class WorkdayPageComponent {
  readonly localStore: WorkdayPageStoreType = inject(WorkdayPageStore);

  selectedDate = '2019-02-28';
  selectedOption = '⛳️';
  secondaryTasks = [{ name: 'Tâche n°2' }, { name: 'Tâche n°3' }];

  remainingTasks = [{ name: 'Tâche n°4' }, { name: 'Tâche n°5' }, { name: 'Tâche n°6' }];

  addTask() {
    const newIndex = this.remainingTasks.length + 4;
    this.remainingTasks.push({ name: `Tâche n°${newIndex}` });
  }
}
