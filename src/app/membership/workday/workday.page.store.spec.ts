import { TestBed } from '@angular/core/testing';
import { WorkdayPageStore } from './workday.page.store';
import { AddTaskUseCase } from '@membership/workday/domain/add-task.use-case';
import { Workday } from '@core/entities/workday.entity';
import { UpdateTaskUseCase } from './domain/update-task.use-case';
import { RemoveTaskUseCase } from './domain/remove-task.use-case';

describe('WorkdayPageStore', () => {
  let store: InstanceType<typeof WorkdayPageStore>;
  let addTaskUseCase: jest.Mocked<AddTaskUseCase>;
  let updateTaskUseCase: jest.Mocked<UpdateTaskUseCase>;
  let removeTaskUseCase: jest.Mocked<RemoveTaskUseCase>;

  beforeEach(() => {
    addTaskUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AddTaskUseCase>;

    updateTaskUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateTaskUseCase>;

    removeTaskUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RemoveTaskUseCase>;

    TestBed.configureTestingModule({
      providers: [
        WorkdayPageStore,
        {
          provide: AddTaskUseCase,
          useValue: addTaskUseCase,
        },
        {
          provide: UpdateTaskUseCase,
          useValue: updateTaskUseCase,
        },
        {
          provide: RemoveTaskUseCase,
          useValue: removeTaskUseCase,
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
    it('should initialize to 1', () => {
      expect(store.taskCount()).toBe(1);
    });

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
    it('should initialize to true', () => {
      expect(store.shouldDisplayAddButton()).toBe(true);
    });

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

  describe('method: updateTask', () => {
    it('should call UpdateTaskUseCase.execute with current workday', () => {
      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.addEmptyTask();
      updateTaskUseCase.execute.mockReturnValue(newWorkday);

      store.updateTask(0, { title: 'Updated task' });

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday, 0, {
        title: 'Updated task',
      });
    });

    it('should update the workday state with the result from use case', () => {
      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.addEmptyTask();
      updateTaskUseCase.execute.mockReturnValue(newWorkday);

      const initialTaskCount = store.taskCount();
      store.updateTask(0, { title: 'Updated task' });

      expect(store.workday()).toBe(newWorkday);
      expect(store.taskCount()).toBe(initialTaskCount + 1);
    });

    it('should maintain immutability (new workday instance)', () => {
      const originalWorkday = store.workday();
      const newWorkday = originalWorkday.addEmptyTask();
      updateTaskUseCase.execute.mockReturnValue(newWorkday);

      store.updateTask(0, { title: 'Updated task' });

      expect(store.workday()).not.toBe(originalWorkday);
      expect(originalWorkday.taskList.length).toBe(1); // Original unchanged
    });

    it('should handle updating task type', () => {
      const currentWorkday = store.workday();
      const updatedWorkday = Workday.create(currentWorkday.date, [
        currentWorkday.taskList[0].withType('Get things done'),
      ]);
      updateTaskUseCase.execute.mockReturnValue(updatedWorkday);

      store.updateTask(0, { type: 'Get things done' });

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday, 0, {
        type: 'Get things done',
      });
    });

    it('should handle updating multiple properties', () => {
      const currentWorkday = store.workday();
      updateTaskUseCase.execute.mockReturnValue(currentWorkday);

      store.updateTask(0, { type: 'Get things done', title: 'New title' });

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday, 0, {
        type: 'Get things done',
        title: 'New title',
      });
    });

    it('should handle empty updates object', () => {
      const currentWorkday = store.workday();
      updateTaskUseCase.execute.mockReturnValue(currentWorkday);

      store.updateTask(0, {});

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday, 0, {});
    });

    it('should update task at specific index', () => {
      let workday = store.workday();
      workday = workday.addEmptyTask().addEmptyTask();

      addTaskUseCase.execute.mockReturnValue(workday);
      store.onAddTask();
      store.onAddTask();

      const updatedWorkday = Workday.create(workday.date, [
        workday.taskList[0],
        workday.taskList[1].withTitle('Middle task'),
        workday.taskList[2],
      ]);
      updateTaskUseCase.execute.mockReturnValue(updatedWorkday);

      store.updateTask(1, { title: 'Middle task' });

      expect(updateTaskUseCase.execute).toHaveBeenCalledWith(workday, 1, {
        title: 'Middle task',
      });
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

  describe('method: removeTask', () => {
    it('should call RemoveTaskUseCase.execute with current workday and index', () => {
      // Add a task first so we have 2 tasks
      const workdayWith2Tasks = store.workday().addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(workdayWith2Tasks);
      store.onAddTask();

      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.removeTask(0);
      removeTaskUseCase.execute.mockReturnValue(newWorkday);

      store.removeTask(0);

      expect(removeTaskUseCase.execute).toHaveBeenCalledWith(currentWorkday, 0);
    });

    it('should update the workday state with the result from use case', () => {
      // Add a task first so we have 2 tasks
      const workdayWith2Tasks = store.workday().addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(workdayWith2Tasks);
      store.onAddTask();

      const currentWorkday = store.workday();
      const newWorkday = currentWorkday.removeTask(0);
      removeTaskUseCase.execute.mockReturnValue(newWorkday);

      const initialTaskCount = store.taskCount();
      store.removeTask(0);

      expect(store.workday()).toBe(newWorkday);
      expect(store.taskCount()).toBe(initialTaskCount - 1);
    });

    it('should maintain immutability (new workday instance)', () => {
      // Add a task first so we have 2 tasks
      const workdayWith2Tasks = store.workday().addEmptyTask();
      addTaskUseCase.execute.mockReturnValue(workdayWith2Tasks);
      store.onAddTask();

      const originalWorkday = store.workday();
      const newWorkday = originalWorkday.removeTask(0);
      removeTaskUseCase.execute.mockReturnValue(newWorkday);

      store.removeTask(0);

      expect(store.workday()).not.toBe(originalWorkday);
      expect(originalWorkday.taskList.length).toBe(2); // Original unchanged
    });
  });
});
