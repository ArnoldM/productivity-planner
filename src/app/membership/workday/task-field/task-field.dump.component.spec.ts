import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskFieldDumpComponent } from './task-field.dump.component';
import { Task } from '@core/entities/task.entity';

describe('TaskFieldDumpComponent', () => {
  let component: TaskFieldDumpComponent;
  let fixture: ComponentFixture<TaskFieldDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFieldDumpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFieldDumpComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', Task.create('Hit the target', 'Test task', 3));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendering task data', () => {
    it('should display the task title', () => {
      const titleInput = fixture.debugElement.query(By.css('[data-testid="task-title-input"]'));
      expect(titleInput.nativeElement.value).toBe('Test task');
    });

    it('should display the task type', () => {
      const typeSelect = fixture.debugElement.query(By.css('[data-testid="task-type-select"]'));
      const selectedOption = typeSelect.nativeElement.selectedOptions[0];
      expect(selectedOption.textContent).toContain('⛳️');
    });

    it('should display the pomodoro count', () => {
      const pomodoroSelect = fixture.debugElement.query(
        By.css('[data-testid="task-pomodoro-count-select"]'),
      );
      const selectedOption = pomodoroSelect.nativeElement.selectedOptions[0];
      expect(selectedOption.textContent?.trim()).toBe('3');
    });

    it('should display all pomodoro buttons', () => {
      const pomodoroButtons = fixture.debugElement.queryAll(
        By.css('[data-testid="task-pomodoro-button"]'),
      );
      expect(pomodoroButtons.length).toBe(3);
    });

    it('should display both type options', () => {
      const typeSelect = fixture.debugElement.query(By.css('[data-testid="task-type-select"]'));
      const options = typeSelect.nativeElement.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].textContent).toContain('⛳️');
      expect(options[1].textContent).toContain('🎯');
    });

    it('should display all pomodoro count options', () => {
      const pomodoroSelect = fixture.debugElement.query(
        By.css('[data-testid="task-pomodoro-count-select"]'),
      );
      const options = pomodoroSelect.nativeElement.querySelectorAll('option');
      expect(options.length).toBe(5);
      expect(options[0].textContent?.trim()).toBe('1');
      expect(options[4].textContent?.trim()).toBe('5');
    });
  });

  describe('when user changes the title', () => {
    it('should emit taskUpdated with the new title', () => {
      const taskUpdatedSpy = jest.fn();
      component.taskUpdated.subscribe(taskUpdatedSpy);

      const titleInput = fixture.debugElement.query(By.css('[data-testid="task-title-input"]'));
      titleInput.nativeElement.value = 'New title';
      titleInput.nativeElement.dispatchEvent(new Event('input'));
      titleInput.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(taskUpdatedSpy).toHaveBeenCalledWith({ title: 'New title' });
    });
  });

  describe('when user changes the type', () => {
    it('should emit taskUpdated with the new type', () => {
      const taskUpdatedSpy = jest.fn();
      component.taskUpdated.subscribe(taskUpdatedSpy);

      const typeSelect = fixture.debugElement.query(By.css('[data-testid="task-type-select"]'));
      typeSelect.nativeElement.selectedIndex = 1;
      typeSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(taskUpdatedSpy).toHaveBeenCalledWith({ type: 'Get things done' });
    });
  });

  describe('when user changes the pomodoro count', () => {
    it('should emit taskUpdated with the new pomodoro count', () => {
      const taskUpdatedSpy = jest.fn();
      component.taskUpdated.subscribe(taskUpdatedSpy);

      const pomodoroSelect = fixture.debugElement.query(
        By.css('[data-testid="task-pomodoro-count-select"]'),
      );
      pomodoroSelect.nativeElement.selectedIndex = 4;
      pomodoroSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(taskUpdatedSpy).toHaveBeenCalledWith({ pomodoroCount: 5 });
    });
  });

  describe('when user clicks delete button', () => {
    it('should emit taskRemoved', () => {
      const taskRemovedSpy = jest.fn();
      component.taskRemoved.subscribe(taskRemovedSpy);

      const deleteButton = fixture.debugElement.query(By.css('[data-testid="task-delete-button"]'));
      deleteButton.nativeElement.click();

      expect(taskRemovedSpy).toHaveBeenCalled();
    });
  });
});
