import { ComponentFixture, TestBed } from '@angular/core/testing';

import WorkdayPageComponent from './workday.page.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { AddTaskUseCase } from '@membership/workday/domain/add-task.use-case';
import { By } from '@angular/platform-browser';
import { UpdateTaskUseCase } from './domain/update-task.use-case';
import { RemoveTaskUseCase } from './domain/remove-task.use-case';

describe('WorkdayPageComponent', () => {
  let component: WorkdayPageComponent;
  let fixture: ComponentFixture<WorkdayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkdayPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        AddTaskUseCase,
        UpdateTaskUseCase,
        RemoveTaskUseCase,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkdayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user views the page', () => {
    it('should display all tasks from the store', () => {
      const taskCards = fixture.debugElement.queryAll(By.css('[data-testid="task-card"]'));

      expect(taskCards.length).toBe(component.localStore.taskCount());
    });

    it('should display task title in input field', () => {
      const firstTaskInput = fixture.debugElement.query(By.css('[data-testid="task-title-input"]'));
      const firstTask = component.localStore.workday().taskList[0];

      expect(firstTaskInput.nativeElement.value).toBe(firstTask.title);
    });

    it('should display all tasks with correct titles', () => {
      const taskInputs = fixture.debugElement.queryAll(By.css('[data-testid="task-title-input"]'));
      const tasks = component.localStore.workday().taskList;

      taskInputs.forEach((input, index) => {
        expect(input.nativeElement.value).toBe(tasks[index].title);
      });
    });

    it('should display delete button for each task', () => {
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="task-delete-button"]'),
      );
      const tasks = component.localStore.workday().taskList;

      expect(deleteButtons.length).toBe(tasks.length);
    });

    it('should display "Ajouter une tâche" button when task list is not full', () => {
      const addButton = fixture.debugElement.query(By.css('[data-testid="add-task-button"]'));

      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent.trim()).toBe('Ajouter une tâche');
    });

    it('should hide "Ajouter une tâche" button when task list is full (6 tasks)', () => {
      // Add tasks until full
      for (let i = 1; i < 6; i++) {
        component.localStore.onAddTask();
      }
      fixture.detectChanges();

      const addButton = fixture.debugElement.query(By.css('[data-testid="add-task-button"]'));

      expect(addButton).toBeNull();
      expect(component.localStore.shouldDisplayAddButton()).toBe(false);
    });
  });

  describe('when user clicks "Ajouter une tâche" button', () => {
    it('should call onAddTask method', () => {
      const spy = jest.spyOn(component.localStore, 'onAddTask');
      const addButton = fixture.debugElement.query(By.css('[data-testid="add-task-button"]'));

      addButton.nativeElement.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should increase task count after adding a task', () => {
      const initialCount = component.localStore.taskCount();
      const addButton = fixture.debugElement.query(By.css('[data-testid="add-task-button"]'));

      addButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.localStore.taskCount()).toBe(initialCount + 1);
    });

    it('should display new task in the DOM after adding', () => {
      const addButton = fixture.debugElement.query(By.css('[data-testid="add-task-button"]'));
      const initialTaskCards = fixture.debugElement.queryAll(By.css('[data-testid="task-card"]'));

      addButton.nativeElement.click();
      fixture.detectChanges();

      const updatedTaskCards = fixture.debugElement.queryAll(By.css('[data-testid="task-card"]'));

      expect(updatedTaskCards.length).toBe(initialTaskCards.length + 1);
    });
  });

  describe('when user clicks delete button on a task', () => {
    it('should call removeTask method with correct index', () => {
      const spy = jest.spyOn(component.localStore, 'removeTask');

      // Add a second task so we can delete one
      component.localStore.onAddTask();
      fixture.detectChanges();

      const deleteButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="task-delete-button"]'),
      );
      const firstDeleteButton = deleteButtons[0].nativeElement;

      firstDeleteButton.click();

      expect(spy).toHaveBeenCalledWith(0);
    });

    it('should remove the task from the list', () => {
      // Add tasks to have multiple tasks
      component.localStore.onAddTask();
      component.localStore.onAddTask();
      fixture.detectChanges();

      const initialCount = component.localStore.taskCount();
      const initialTaskCards = fixture.debugElement.queryAll(By.css('[data-testid="task-card"]'));

      const deleteButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="task-delete-button"]'),
      );
      const firstDeleteButton = deleteButtons[0].nativeElement;

      firstDeleteButton.click();
      fixture.detectChanges();

      const updatedTaskCards = fixture.debugElement.queryAll(By.css('[data-testid="task-card"]'));

      expect(component.localStore.taskCount()).toBe(initialCount - 1);
      expect(updatedTaskCards.length).toBe(initialTaskCards.length - 1);
    });

    it('should shift remaining tasks up to fill the gap', () => {
      // Add a task and update titles
      component.localStore.onAddTask();
      component.localStore.updateTask(0, { title: 'First Task' });
      component.localStore.updateTask(1, { title: 'Second Task' });

      const tasksBeforeRemoval = component.localStore.workday().taskList;
      const secondTaskTitle = tasksBeforeRemoval[1].title;

      // Remove first task
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="task-delete-button"]'),
      );
      const firstDeleteButton = deleteButtons[0].nativeElement;

      firstDeleteButton.click();

      const tasksAfterRemoval = component.localStore.workday().taskList;

      // The second task should now be at index 0
      expect(tasksAfterRemoval[0].title).toBe(secondTaskTitle);
      expect(tasksAfterRemoval[0].title).toBe('Second Task');
    });
  });
});
