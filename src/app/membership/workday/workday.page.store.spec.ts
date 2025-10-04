import { TestBed } from '@angular/core/testing';
import { WorkdayPageStore } from './workday.page.store';
import { AddTaskUseCase } from '@membership/workday/domain/add-task.use-case';
import { Workday } from '@core/entities/workday.entity';

describe('WorkdayPageStore', () => {
  let store: InstanceType<typeof WorkdayPageStore>;
  let addTaskUseCase: jest.Mocked<AddTaskUseCase>;

  beforeEach(() => {
    addTaskUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AddTaskUseCase>;

    TestBed.configureTestingModule({
      providers: [
        WorkdayPageStore,
        {
          provide: AddTaskUseCase,
          useValue: addTaskUseCase,
        },
      ],
    });

    store = TestBed.inject(WorkdayPageStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have a workday with one empty task', () => {
      expect(store.workday()).toBeInstanceOf(Workday);
      expect(store.workday().taskList.length).toBe(1);
    });
  });

  describe('computed: taskCount', () => {
    it('should return the correct number of tasks', () => {
      expect(store.taskCount()).toBe(1);
    });

    it('should update when workday changes', () => {
      const newWorkday = store.workday().addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(newWorkday);

      store.onAddTask();

      expect(store.taskCount()).toBe(2);
    });
  });

  describe('computed: shouldDisplayAddButton', () => {
    it('should return true when task list is not full', () => {
      expect(store.shouldDisplayAddButton()).toBe(true);
    });

    it('should return false when task list is full (6 tasks)', () => {
      let workday = store.workday();

      // Add tasks until full (max 6)
      for (let i = 1; i < 6; i++) {
        workday = workday.addEmptyTask();
        addTaskUseCase.execute.mockReturnValue(workday);
        store.onAddTask();
      }

      expect(store.shouldDisplayAddButton()).toBe(false);
      expect(store.workday().isTaskListFull()).toBe(true);
    });
  });

  describe('method: onAddTask', () => {
    it('should call AddTaskUseCase.execute with current workday', () => {
      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(newWorkday);

      store.onAddTask();

      expect(addTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday);
    });

    it('should update the workday state with the result from use case', () => {
      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(newWorkday);

      const initialTaskCount = store.taskCount();
      store.onAddTask();

      expect(store.workday()).toBe(newWorkday);
      expect(store.taskCount()).toBe(initialTaskCount + 1);
    });

    it('should maintain immutability (new workday instance)', () => {
      const originalWorkday = store.workday();
      const newWorkday = originalWorkday.addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(newWorkday);

      store.onAddTask();

      expect(store.workday()).not.toBe(originalWorkday);
      expect(originalWorkday.taskList.length).toBe(1); // Original unchanged
    });
  });
});
