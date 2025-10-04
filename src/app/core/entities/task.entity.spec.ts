import { Task } from './task.entity';

describe('Task', () => {
  describe('createEmptyTask', () => {
    it('should create a task with default values', () => {
      const task = Task.createEmptyTask();

      expect(task).toBeInstanceOf(Task);
      expect(task.type).toBe('Hit the target');
      expect(task.title).toBe('Nouvelle tâche');
      expect(task.pomodoroCount).toBe(1);
      expect(task.pomodoroList).toEqual(['Not started']);
    });
  });

  describe('constructor validation', () => {
    it('should throw error if title is empty', () => {
      expect(() => {
        new (Task as any)('Hit the target', '', 1);
      }).toThrow('Task title cannot be empty');
    });

    it('should throw error if title is only whitespace', () => {
      expect(() => {
        new (Task as any)('Hit the target', '   ', 1);
      }).toThrow('Task title cannot be empty');
    });

    it('should throw error if pomodoro list length does not match count', () => {
      expect(() => {
        new (Task as any)('Hit the target', 'Test', 3, ['Not started']);
      }).toThrow('Pomodoro list length(1) must match pomodoro count (3)');
    });

    it('should create pomodoro list from count if not provided', () => {
      const task = new (Task as any)('Hit the target', 'Test', 3);

      expect(task.pomodoroList).toEqual(['Not started', 'Not started', 'Not started']);
    });

    it('should accept valid pomodoro list', () => {
      const pomodoroList = ['In progress', 'Done', 'Not started'];
      const task = new (Task as any)('Hit the target', 'Test', 3, pomodoroList);

      expect(task.pomodoroList).toEqual(pomodoroList);
    });
  });

  describe('type', () => {
    it('should be "Hit the target"', () => {
      const task = new (Task as any)('Hit the target', 'Test', 1);

      expect(task.type).toBe('Hit the target');
    });

    it('should be "Get things done"', () => {
      const task = new (Task as any)('Get things done', 'Test', 1);

      expect(task.type).toBe('Get things done');
    });
  });

  describe('title getter', () => {
    it('should return the task title', () => {
      const task = Task.createEmptyTask();

      expect(task.title).toBe('Nouvelle tâche');
    });
  });

  describe('pomodoroCount getter', () => {
    it('should return the pomodoro count', () => {
      const task = new (Task as any)('Hit the target', 'Test', 3);

      expect(task.pomodoroCount).toBe(3);
    });
  });

  describe('pomodoroList getter', () => {
    it('should return the pomodoro list', () => {
      const task = Task.createEmptyTask();

      expect(task.pomodoroList).toEqual(['Not started']);
    });
  });

  describe('withTitle', () => {
    it('should return a new Task with updated title', () => {
      const task = Task.createEmptyTask();

      const result = task.withTitle('Updated Title');

      expect(result).not.toBe(task);
      expect(result.title).toBe('Updated Title');
    });

    it('should not mutate the original task', () => {
      const task = Task.createEmptyTask();
      const originalTitle = task.title;

      task.withTitle('Updated Title');

      expect(task.title).toBe(originalTitle);
    });

    it('should throw error if new title is empty', () => {
      const task = Task.createEmptyTask();

      expect(() => task.withTitle('')).toThrow('Task title cannot be empty');
    });

    it('should throw error if new title is only whitespace', () => {
      const task = Task.createEmptyTask();

      expect(() => task.withTitle('   ')).toThrow('Task title cannot be empty');
    });
  });

  describe('withPomodoroStatus', () => {
    it('should return a new Task with updated status', () => {
      const task = new (Task as any)('Hit the target', 'Test', 3);

      const result = task.withPomodoroStatus(1, 'In progress');

      expect(result).not.toBe(task);
      expect(result.pomodoroList[1]).toBe('In progress');
    });

    it('should not mutate the original task', () => {
      const task = Task.createEmptyTask();

      task.withPomodoroStatus(0, 'Done');

      expect(task.pomodoroList[0]).toBe('Not started');
    });

    it('should update to "Done" status', () => {
      const task = Task.createEmptyTask();

      const result = task.withPomodoroStatus(0, 'Done');

      expect(result.pomodoroList[0]).toBe('Done');
    });

    it('should throw error if index is negative', () => {
      const task = Task.createEmptyTask();

      expect(() => task.withPomodoroStatus(-1, 'Done')).toThrow('Invalid pomodoro index');
    });

    it('should throw error if index is out of bounds', () => {
      const task = Task.createEmptyTask();

      expect(() => task.withPomodoroStatus(5, 'Done')).toThrow('Invalid pomodoro index');
    });
  });

  describe('withPomodoroCount', () => {
    it('should return a new Task with updated count', () => {
      const task = Task.createEmptyTask();

      const result = task.withPomodoroCount(3);

      expect(result).not.toBe(task);
      expect(result.pomodoroCount).toBe(3);
      expect(result.pomodoroList.length).toBe(3);
      expect(result.pomodoroList).toEqual(['Not started', 'Not started', 'Not started']);
    });

    it('should not mutate the original task', () => {
      const task = Task.createEmptyTask();

      task.withPomodoroCount(3);

      expect(task.pomodoroCount).toBe(1);
    });

    it('should preserve existing statuses when increasing count', () => {
      const task = new (Task as any)('Hit the target', 'Test', 2, ['Done', 'In progress']);

      const result = task.withPomodoroCount(4);

      expect(result.pomodoroList).toEqual(['Done', 'In progress', 'Not started', 'Not started']);
    });

    it('should truncate list when decreasing count', () => {
      const task = new (Task as any)('Hit the target', 'Test', 4, [
        'Done',
        'In progress',
        'Not started',
        'Not started',
      ]);

      const result = task.withPomodoroCount(2);

      expect(result.pomodoroList).toEqual(['Done', 'In progress']);
    });

    it('should return same instance if count is the same', () => {
      const task = Task.createEmptyTask();

      const result = task.withPomodoroCount(1);

      expect(result).toBe(task);
    });
  });

  describe('edge cases', () => {
    it('should handle minimum pomodoro count (1)', () => {
      const task = new (Task as any)('Hit the target', 'Test', 1);

      expect(task.pomodoroCount).toBe(1);
      expect(task.pomodoroList.length).toBe(1);
    });

    it('should handle maximum pomodoro count (5)', () => {
      const task = new (Task as any)('Hit the target', 'Test', 5);

      expect(task.pomodoroCount).toBe(5);
      expect(task.pomodoroList.length).toBe(5);
    });

    it('should trim title whitespace during validation', () => {
      const task = new (Task as any)('Hit the target', '  Valid Title  ', 1);

      // Title is stored as-is, but validation checks trimmed version
      expect(task.title).toBe('  Valid Title  ');
    });
  });
});