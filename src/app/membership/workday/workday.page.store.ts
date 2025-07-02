import { signalStore, withComputed, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface Pomodoro {
  status: 'Not started' | 'In progress' | 'Done';
}

type PomodoroList =
  | [Pomodoro]
  | [Pomodoro, Pomodoro]
  | [Pomodoro, Pomodoro, Pomodoro]
  | [Pomodoro, Pomodoro, Pomodoro, Pomodoro]
  | [Pomodoro, Pomodoro, Pomodoro, Pomodoro, Pomodoro];

interface Task {
  type: 'Hit the target' | 'Get things done';
  title: string;
  pomodoroCount: 1 | 2 | 3 | 4 | 5;
  pomodoroList: PomodoroList;
}

type TaskList =
  | []
  | [Task]
  | [Task, Task]
  | [Task, Task, Task]
  | [Task, Task, Task, Task]
  | [Task, Task, Task, Task, Task]
  | [Task, Task, Task, Task, Task, Task];

interface WorkdayState {
  date: string;
  taskList: TaskList;
}

const initialState: WorkdayState = {
  date: '',
  taskList: [
    {
      type: 'Hit the target',
      title: 'Nouvelle tâche',
      pomodoroList: [{ status: 'Not started' }],
      pomodoroCount: 1,
    },
  ],
};

export const WorkdayPageStore = signalStore(
  withState<WorkdayState>(initialState),
  withComputed((store) => {
    const getMostImportantTask = computed<Task>(() => store.taskList()[0]!);

    return { getMostImportantTask };
  }),
);

export type WorkdayPageStoreType = InstanceType<typeof WorkdayPageStore>;
