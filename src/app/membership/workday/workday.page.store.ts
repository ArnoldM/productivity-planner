import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Workday } from '@core/entities/workday.entity';
import { computed, inject } from '@angular/core';
import { AddTaskUseCase } from '@membership/workday/domain/add-task.use-case';
import { TaskUpdates, UpdateTaskUseCase } from './domain/update-task.use-case';
import { RemoveTaskUseCase } from './domain/remove-task.use-case';

interface WorkdayState {
  workday: Workday;
}

const initialState: WorkdayState = {
  workday: Workday.createEmptyWorkday(),
};

export const WorkdayPageStore = signalStore(
  withState<WorkdayState>(initialState),
  withComputed((state) => {
    const taskCount = computed(() => {
      return state.workday().taskList.length;
    });
    const shouldDisplayAddButton = computed(() => {
      return !state.workday().isTaskListFull();
    });
    return { taskCount, shouldDisplayAddButton };
  }),
  withMethods(
    (
      store,
      addTaskUseCase = inject(AddTaskUseCase),
      updateTaskUseCase = inject(UpdateTaskUseCase),
      removeTaskUseCase = inject(RemoveTaskUseCase),
    ) => ({
      onAddTask() {
        const workday = addTaskUseCase.execute(store.workday());
        patchState(store, () => ({ workday }));
      },
      updateTask(taskIndex: number, updates: TaskUpdates) {
        const workday = updateTaskUseCase.execute(store.workday(), taskIndex, updates);
        patchState(store, () => ({ workday }));
      },
      removeTask(taskIndex: number) {
        const workday = removeTaskUseCase.execute(store.workday(), taskIndex);
        patchState(store, () => ({ workday }));
      },
      updateWorkdayDate(date: string) {
        const workday = store.workday().withDate(date);
        patchState(store, () => ({ workday }));
      },
    }),
  ),
);

export type WorkdayPageStoreType = InstanceType<typeof WorkdayPageStore>;
