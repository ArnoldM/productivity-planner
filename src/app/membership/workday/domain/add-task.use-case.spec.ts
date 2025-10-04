import { TestBed } from '@angular/core/testing';
import { AddTaskUseCase } from './add-task.use-case';
import { Workday } from '@core/entities/workday.entity';
import { Task } from '@core/entities/task.entity';

describe('AddTaskUseCase', () => {
  let useCase: AddTaskUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddTaskUseCase],
    });
    useCase = TestBed.inject(AddTaskUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    it('should add an empty task when no task is provided', () => {
      const workday = Workday.createEmptyWorkday();
      const initialTaskCount = workday.taskList.length;

      const result = useCase.execute(workday);

      expect(result.taskList.length).toBe(initialTaskCount + 1);
      expect(result.taskList[result.taskList.length - 1].title).toBe('Nouvelle tâche');
    });

    it('should add a specific task when task is provided', () => {
      const workday = Workday.createEmptyWorkday();
      const customTask = Task.createEmptyTask().withTitle('Ma tâche personnalisée');
      const initialTaskCount = workday.taskList.length;

      const result = useCase.execute(workday, customTask);

      expect(result.taskList.length).toBe(initialTaskCount + 1);
      expect(result.taskList[result.taskList.length - 1]).toBe(customTask);
      expect(result.taskList[result.taskList.length - 1].title).toBe('Ma tâche personnalisée');
    });

    it('should return a new Workday instance (immutability)', () => {
      const workday = Workday.createEmptyWorkday();

      const result = useCase.execute(workday);

      expect(result).not.toBe(workday);
      expect(result).toBeInstanceOf(Workday);
    });

    it('should not mutate the original Workday', () => {
      const workday = Workday.createEmptyWorkday();
      const initialTaskCount = workday.taskList.length;

      useCase.execute(workday);

      expect(workday.taskList.length).toBe(initialTaskCount);
    });

    it('should throw an error when task list is full', () => {
      let workday = Workday.createEmptyWorkday();

      // Add tasks until full (max 6)
      for (let i = 1; i < 6; i++) {
        workday = workday.addEmptyTask();
      }

      expect(() => useCase.execute(workday)).toThrow(
        'Cannot add more than 6 tasks to a workday.',
      );
    });

    it('should maintain the workday date when adding a task', () => {
      const workday = Workday.createEmptyWorkday();
      const originalDate = workday.date;

      const result = useCase.execute(workday);

      expect(result.date).toBe(originalDate);
    });
  });
});
