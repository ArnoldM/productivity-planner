import { Workday } from './workday.entity';
import { Task } from './task.entity';

describe('Workday', () => {
  describe('createEmptyWorkday', () => {
    it('should create a workday with one empty task', () => {
      const workday = Workday.createEmptyWorkday();

      expect(workday).toBeInstanceOf(Workday);
      expect(workday.taskList.length).toBe(1);
      expect(workday.taskList[0]).toBeInstanceOf(Task);
    });

    it('should create a workday with today date', () => {
      const workday = Workday.createEmptyWorkday();
      const today = new Date().toISOString().split('T')[0];

      expect(workday.date).toBe(today);
    });
  });

  describe('constructor validation', () => {
    it('should throw error if date is invalid', () => {
      expect(() => {
        Workday.create('invalid-date', [Task.createEmptyTask()]);
      }).toThrow('Invalid date format.');
    });

    it('should throw error if task list is empty', () => {
      expect(() => {
        Workday.create(new Date(), []);
      }).toThrow('Task list must contain between 1 and 6 tasks.');
    });

    it('should throw error if task list has more than 6 tasks', () => {
      const tasks = Array.from({ length: 7 }, () => Task.createEmptyTask());

      expect(() => {
        Workday.create(new Date(), tasks);
      }).toThrow('Task list must contain between 1 and 6 tasks.');
    });

    it('should accept Date object', () => {
      const date = new Date('2025-01-15');
      const workday = Workday.create(date, [Task.createEmptyTask()]);

      expect(workday.date).toBe('2025-01-15');
    });

    it('should accept string date', () => {
      const workday = Workday.create('2025-01-15', [Task.createEmptyTask()]);

      expect(workday.date).toBe('2025-01-15');
    });
  });

  describe('addTask', () => {
    it('should return a new Workday instance', () => {
      const workday = Workday.createEmptyWorkday();
      const task = Task.createEmptyTask();

      const result = workday.addTask(task);

      expect(result).not.toBe(workday);
      expect(result).toBeInstanceOf(Workday);
    });

    it('should add task to the task list', () => {
      const workday = Workday.createEmptyWorkday();
      const task = Task.createEmptyTask().withTitle('New Task');

      const result = workday.addTask(task);

      expect(result.taskList.length).toBe(2);
      expect(result.taskList[1].title).toBe('New Task');
    });

    it('should not mutate the original workday', () => {
      const workday = Workday.createEmptyWorkday();
      const task = Task.createEmptyTask();
      const originalLength = workday.taskList.length;

      workday.addTask(task);

      expect(workday.taskList.length).toBe(originalLength);
    });

    it('should throw error when task list is full (6 tasks)', () => {
      let workday = Workday.createEmptyWorkday();

      for (let i = 1; i < 6; i++) {
        workday = workday.addEmptyTask();
      }

      expect(() => workday.addTask(Task.createEmptyTask())).toThrow(
        'Cannot add more than 6 tasks to a workday.',
      );
    });

    it('should preserve the date', () => {
      const workday = Workday.createEmptyWorkday();
      const originalDate = workday.date;
      const task = Task.createEmptyTask();

      const result = workday.addTask(task);

      expect(result.date).toBe(originalDate);
    });
  });

  describe('addEmptyTask', () => {
    it('should add an empty task', () => {
      const workday = Workday.createEmptyWorkday();

      const result = workday.addEmptyTask();

      expect(result.taskList.length).toBe(2);
      expect(result.taskList[1].title).toBe('Nouvelle tâche');
    });

    it('should return a new Workday instance', () => {
      const workday = Workday.createEmptyWorkday();

      const result = workday.addEmptyTask();

      expect(result).not.toBe(workday);
    });
  });

  describe('removeTask', () => {
    it('should return a new Workday instance', () => {
      const workday = Workday.createEmptyWorkday().addEmptyTask();

      const result = workday.removeTask(0);

      expect(result).not.toBe(workday);
      expect(result).toBeInstanceOf(Workday);
    });

    it('should remove task at specified index', () => {
      let workday = Workday.createEmptyWorkday();
      const task1 = Task.createEmptyTask().withTitle('Task 1');
      const task2 = Task.createEmptyTask().withTitle('Task 2');

      workday = workday.addTask(task1).addTask(task2);

      const result = workday.removeTask(1);

      expect(result.taskList.length).toBe(2);
      expect(result.taskList[0].title).toBe('Nouvelle tâche');
      expect(result.taskList[1].title).toBe('Task 2');
    });

    it('should not mutate the original workday', () => {
      const workday = Workday.createEmptyWorkday().addEmptyTask();
      const originalLength = workday.taskList.length;

      workday.removeTask(0);

      expect(workday.taskList.length).toBe(originalLength);
    });

    it('should throw error when removing from single task workday', () => {
      const workday = Workday.createEmptyWorkday();

      expect(() => workday.removeTask(0)).toThrow('A workday must have at least one task.');
    });

    it('should throw error when index is negative', () => {
      const workday = Workday.createEmptyWorkday().addEmptyTask();

      expect(() => workday.removeTask(-1)).toThrow('Invalid task index.');
    });

    it('should throw error when index is out of bounds', () => {
      const workday = Workday.createEmptyWorkday().addEmptyTask();

      expect(() => workday.removeTask(5)).toThrow('Invalid task index.');
    });
  });

  describe('replaceTask', () => {
    it('should return a new Workday instance', () => {
      const workday = Workday.createEmptyWorkday();
      const newTask = Task.createEmptyTask();

      const result = workday.replaceTask(0, newTask);

      expect(result).not.toBe(workday);
      expect(result).toBeInstanceOf(Workday);
    });

    it('should replace task at specified index', () => {
      const workday = Workday.createEmptyWorkday();
      const newTask = Task.createEmptyTask().withTitle('Replaced Task');

      const result = workday.replaceTask(0, newTask);

      expect(result.taskList[0].title).toBe('Replaced Task');
    });

    it('should not mutate the original workday', () => {
      const workday = Workday.createEmptyWorkday();
      const originalTitle = workday.taskList[0].title;
      const newTask = Task.createEmptyTask().withTitle('Replaced Task');

      workday.replaceTask(0, newTask);

      expect(workday.taskList[0].title).toBe(originalTitle);
    });

    it('should throw error when index is negative', () => {
      const workday = Workday.createEmptyWorkday();
      const newTask = Task.createEmptyTask();

      expect(() => workday.replaceTask(-1, newTask)).toThrow('Invalid task index.');
    });

    it('should throw error when index is out of bounds', () => {
      const workday = Workday.createEmptyWorkday();
      const newTask = Task.createEmptyTask();

      expect(() => workday.replaceTask(5, newTask)).toThrow('Invalid task index.');
    });
  });

  describe('withDate', () => {
    it('should return a new Workday instance', () => {
      const workday = Workday.createEmptyWorkday();

      const result = workday.withDate('2025-12-25');

      expect(result).not.toBe(workday);
      expect(result).toBeInstanceOf(Workday);
    });

    it('should update the date', () => {
      const workday = Workday.createEmptyWorkday();

      const result = workday.withDate('2025-12-25');

      expect(result.date).toBe('2025-12-25');
    });

    it('should preserve the task list', () => {
      let workday = Workday.createEmptyWorkday();
      workday = workday.addTask(Task.createEmptyTask().withTitle('Task 1'));
      workday = workday.addTask(Task.createEmptyTask().withTitle('Task 2'));

      const result = workday.withDate('2025-12-25');

      expect(result.taskList.length).toBe(3);
      expect(result.taskList[0].title).toBe('Nouvelle tâche');
      expect(result.taskList[1].title).toBe('Task 1');
      expect(result.taskList[2].title).toBe('Task 2');
    });

    it('should not mutate the original workday', () => {
      const workday = Workday.createEmptyWorkday();
      const originalDate = workday.date;

      workday.withDate('2025-12-25');

      expect(workday.date).toBe(originalDate);
    });

    it('should throw error if date is invalid', () => {
      const workday = Workday.createEmptyWorkday();

      expect(() => workday.withDate('invalid-date')).toThrow('Invalid date format.');
    });
  });

  describe('isTaskListFull', () => {
    it('should return false when task list is not full', () => {
      const workday = Workday.createEmptyWorkday();

      expect(workday.isTaskListFull()).toBe(false);
    });

    it('should return true when task list has 6 tasks', () => {
      let workday = Workday.createEmptyWorkday();

      for (let i = 1; i < 6; i++) {
        workday = workday.addEmptyTask();
      }

      expect(workday.isTaskListFull()).toBe(true);
    });
  });

  describe('taskList getter', () => {
    it('should return readonly task list', () => {
      const workday = Workday.createEmptyWorkday();
      const taskList = workday.taskList;

      expect(taskList).toBeDefined();
      expect(Array.isArray(taskList)).toBe(true);
    });
  });
});
