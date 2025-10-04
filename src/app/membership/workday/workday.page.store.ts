import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Workday } from '@core/entities/workday.entity';

interface WorkdayState {
  workday: Workday;
}

const initialState: WorkdayState = {
  workday: Workday.createEmptyWorkday(),
};

export const WorkdayPageStore = signalStore(
  withState<WorkdayState>(initialState),
  withMethods((store) => ({
    onAddTask() {
      const workday = store.workday();

      workday.addEmptyTask();
      patchState(store, () => ({ workday }));
    },
  })),
);

export type WorkdayPageStoreType = InstanceType<typeof WorkdayPageStore>;
