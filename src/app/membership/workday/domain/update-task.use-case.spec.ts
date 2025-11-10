import { TestBed } from '@angular/core/testing';
import { UpdateTaskUseCase } from './update-task.use-case';
import { Workday } from '@core/entities/workday.entity';
import { Task, TaskType } from '@core/entities/task.entity';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateTaskUseCase],
    });
    useCase = TestBed.inject(UpdateTaskUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    describe('single property updates', () => {
      it('should update only the task type', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalTask = workday.taskList[0];

        const result = useCase.execute(workday, 0, { type: 'Get things done' });

        expect(result.taskList[0].type).toBe('Get things done');
        expect(result.taskList[0].title).toBe(originalTask.title);
        expect(result.taskList[0].pomodoroCount).toBe(originalTask.pomodoroCount);
      });

      it('should update only the task title', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalTask = workday.taskList[0];

        const result = useCase.execute(workday, 0, { title: 'Updated title' });

        expect(result.taskList[0].title).toBe('Updated title');
        expect(result.taskList[0].type).toBe(originalTask.type);
        expect(result.taskList[0].pomodoroCount).toBe(originalTask.pomodoroCount);
      });

      it('should update only the pomodoro count', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalTask = workday.taskList[0];

        const result = useCase.execute(workday, 0, { pomodoroCount: 3 });

        expect(result.taskList[0].pomodoroCount).toBe(3);
        expect(result.taskList[0].type).toBe(originalTask.type);
        expect(result.taskList[0].title).toBe(originalTask.title);
      });

      it('should update only a pomodoro status at specific index', () => {
        const task = Task.create('Hit the target', 'Test', 3);
        const workday = Workday.create(new Date(), [task]);

        const result = useCase.execute(workday, 0, {
          pomodoroStatusAtIndex: { index: 1, status: 'In progress' },
        });

        expect(result.taskList[0].pomodoroList[1]).toBe('In progress');
        expect(result.taskList[0].pomodoroList[0]).toBe('Not started');
        expect(result.taskList[0].pomodoroList[2]).toBe('Not started');
      });
    });

    describe('multiple properties updates', () => {
      it('should update multiple properties at once', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        const result = useCase.execute(workday, 0, {
          type: 'Get things done',
          title: 'Multi-update task',
        });

        expect(result.taskList[0].type).toBe('Get things done');
        expect(result.taskList[0].title).toBe('Multi-update task');
      });

      it('should update all properties together', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        const result = useCase.execute(workday, 0, {
          type: 'Get things done',
          title: 'Complete update',
          pomodoroCount: 4,
        });

        expect(result.taskList[0].type).toBe('Get things done');
        expect(result.taskList[0].title).toBe('Complete update');
        expect(result.taskList[0].pomodoroCount).toBe(4);
      });
    });

    describe('immutability', () => {
      it('should return a new Workday instance', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        const result = useCase.execute(workday, 0, { type: 'Get things done' });

        expect(result).not.toBe(workday);
        expect(result).toBeInstanceOf(Workday);
      });

      it('should not mutate the original workday', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalType = workday.taskList[0].type;

        useCase.execute(workday, 0, { type: 'Get things done' });

        expect(workday.taskList[0].type).toBe(originalType);
      });

      it('should not mutate the original task', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalTask = workday.taskList[0];

        const result = useCase.execute(workday, 0, { title: 'New title' });

        expect(result.taskList[0]).not.toBe(originalTask);
        expect(originalTask.title).toBe('Nouvelle tâche');
      });
    });

    describe('validation and errors', () => {
      it('should throw error if task index is negative', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        expect(() => useCase.execute(workday, -1, { title: 'Test' })).toThrow(
          'Invalid task index.',
        );
      });

      it('should throw error if task index is out of bounds', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        expect(() => useCase.execute(workday, 10, { title: 'Test' })).toThrow(
          'Invalid task index.',
        );
      });

      it('should throw error if title is empty', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        expect(() => useCase.execute(workday, 0, { title: '' })).toThrow(
          'Task title cannot be empty',
        );
      });

      it('should throw error if type is invalid', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        expect(() => useCase.execute(workday, 0, { type: 'Invalid' as TaskType })).toThrow(
          'Invalid task type',
        );
      });

      it('should throw error if pomodoro status index is invalid', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();

        expect(() =>
          useCase.execute(workday, 0, {
            pomodoroStatusAtIndex: { index: 10, status: 'Done' },
          }),
        ).toThrow('Invalid pomodoro index');
      });
    });

    describe('edge cases', () => {
      it('should handle empty updates object', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalTask = workday.taskList[0];

        const result = useCase.execute(workday, 0, {});

        expect(result).not.toBe(workday);
        expect(result.taskList[0].type).toBe(originalTask.type);
        expect(result.taskList[0].title).toBe(originalTask.title);
      });

      it('should update the first task (index 0)', () => {
        let workday = Workday.createEmptyWorkday().addEmptyTask();
        workday = workday.addTask(Task.create('Hit the target', 'Task 2', 1));

        const result = useCase.execute(workday, 0, { title: 'Updated first' });

        expect(result.taskList[0].title).toBe('Updated first');
        expect(result.taskList[1].title).toBe('Task 2');
      });

      it('should update the last task in a workday with multiple tasks', () => {
        let workday = Workday.createEmptyWorkday().addEmptyTask();
        workday = workday.addTask(Task.create('Hit the target', 'Task 2', 1));
        workday = workday.addTask(Task.create('Hit the target', 'Task 3', 1));

        const result = useCase.execute(workday, 2, { title: 'Updated last' });

        expect(result.taskList[2].title).toBe('Updated last');
        expect(result.taskList[0].title).toBe('Nouvelle tâche');
        expect(result.taskList[1].title).toBe('Task 2');
      });
    });

    describe('integration', () => {
      it('should preserve other tasks when updating a single task', () => {
        let workday = Workday.createEmptyWorkday().addEmptyTask();
        workday = workday.addTask(Task.create('Get things done', 'Task 2', 2));
        workday = workday.addTask(Task.create('Hit the target', 'Task 3', 3));

        const result = useCase.execute(workday, 1, { title: 'Updated middle task' });

        expect(result.taskList[0].title).toBe('Nouvelle tâche');
        expect(result.taskList[1].title).toBe('Updated middle task');
        expect(result.taskList[1].type).toBe('Get things done');
        expect(result.taskList[1].pomodoroCount).toBe(2);
        expect(result.taskList[2].title).toBe('Task 3');
      });

      it('should maintain workday date when updating a task', () => {
        const workday = Workday.createEmptyWorkday().addEmptyTask();
        const originalDate = workday.date;

        const result = useCase.execute(workday, 0, { title: 'Updated task' });

        expect(result.date).toBe(originalDate);
      });
    });
  });
});
