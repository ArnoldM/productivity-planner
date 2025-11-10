import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyWorkdayDumbComponent } from './empty-workday.dumb.component';
import { By } from '@angular/platform-browser';

describe('EmptyWorkdayDumbComponent', () => {
  let component: EmptyWorkdayDumbComponent;
  let fixture: ComponentFixture<EmptyWorkdayDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyWorkdayDumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyWorkdayDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component is rendered', () => {
    it('should display the empty workday container', () => {
      const container = fixture.debugElement.query(By.css('[data-testid="empty-workday"]'));

      expect(container).toBeTruthy();
    });

    it('should display the inbox zero GIF image', () => {
      const image = fixture.debugElement.query(By.css('[data-testid="empty-workday-image"]'));

      expect(image).toBeTruthy();
      expect(image.nativeElement.getAttribute('ngSrc')).toBe(
        '/images/productivity-planner-inbox-zero.gif',
      );
      expect(image.nativeElement.alt).toBe('Aucune tâche prévue');
    });

    it('should display the empty message', () => {
      const message = fixture.debugElement.query(By.css('[data-testid="empty-workday-message"]'));

      expect(message).toBeTruthy();
      expect(message.nativeElement.textContent.trim()).toBe("Aucune tâche prévue pour aujourd'hui");
    });
  });
});
