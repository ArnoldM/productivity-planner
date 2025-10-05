import { ComponentFixture, TestBed } from '@angular/core/testing';

import WorkdayPageComponent from './workday.page.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { AddTaskUseCase } from '@membership/workday/domain/add-task.use-case';
import { By } from '@angular/platform-browser';
import { UpdateTaskUseCase } from './domain/update-task.use-case';

describe('WorkdayPageComponent', () => {
  let component: WorkdayPageComponent;
  let fixture: ComponentFixture<WorkdayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkdayPageComponent],
      providers: [provideZonelessChangeDetection(), AddTaskUseCase, UpdateTaskUseCase],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkdayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Task display', () => {
    it('should display tasks from the store', () => {
      const taskCards = fixture.debugElement.queryAll(By.css('.card'));

      expect(taskCards.length).toBe(component.localStore.taskCount());
    });

    it('should display task title in input field', () => {
      const firstTaskInput = fixture.debugElement.query(By.css('.card input'));
      const firstTask = component.localStore.workday().taskList[0];

      expect(firstTaskInput.nativeElement.value).toBe(firstTask.title);
    });

    it('should display all tasks with correct titles', () => {
      const taskInputs = fixture.debugElement.queryAll(By.css('.card input'));
      const tasks = component.localStore.workday().taskList;

      taskInputs.forEach((input, index) => {
        expect(input.nativeElement.value).toBe(tasks[index].title);
      });
    });
  });

  describe('Add task button display', () => {
    it('should display "Ajouter une tâche" button when task list is not full', () => {
      const addButton = fixture.debugElement.query(By.css('button.btn-link'));

      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent.trim()).toBe('Ajouter une tâche');
    });

    it('should hide "Ajouter une tâche" button when task list is full (6 tasks)', () => {
      // Add tasks until full
      for (let i = 1; i < 6; i++) {
        component.localStore.onAddTask();
      }
      fixture.detectChanges();

      const addButton = fixture.debugElement.query(By.css('button.btn-link'));

      expect(addButton).toBeNull();
      expect(component.localStore.shouldDisplayAddButton()).toBe(false);
    });
  });

  describe('Add task interaction', () => {
    it('should call onAddTask when clicking "Ajouter une tâche" button', () => {
      const spy = jest.spyOn(component.localStore, 'onAddTask');
      const addButton = fixture.debugElement.query(By.css('button.btn-link'));

      addButton.nativeElement.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should increase task count after adding a task', () => {
      const initialCount = component.localStore.taskCount();
      const addButton = fixture.debugElement.query(By.css('button.btn-link'));

      addButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.localStore.taskCount()).toBe(initialCount + 1);
    });

    it('should display new task in the DOM after adding', () => {
      const addButton = fixture.debugElement.query(By.css('button.btn-link'));
      const initialTaskCards = fixture.debugElement.queryAll(By.css('.card'));

      addButton.nativeElement.click();
      fixture.detectChanges();

      const updatedTaskCards = fixture.debugElement.queryAll(By.css('.card'));

      expect(updatedTaskCards.length).toBe(initialTaskCards.length + 1);
    });
  });
});
