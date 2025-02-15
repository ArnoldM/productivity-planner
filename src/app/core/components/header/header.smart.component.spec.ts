import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.smart.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const titleElement = fixture.debugElement.query(By.css('[data-testid="navbarTitle"]'));

    expect(titleElement.nativeElement.textContent).toBe('Productivity Planner');
  });

  it('should display nav links', () => {
    const loginLinkElement = fixture.debugElement.query(By.css('[data-testid="loginLink"]'));
    const signupLinkElement = fixture.debugElement.query(By.css('[data-testid="signupLink"]'));
    const homeLinkElement = fixture.debugElement.query(By.css('[data-testid="homeLink"]'));

    expect(loginLinkElement).toBeTruthy();
    expect(signupLinkElement).toBeTruthy();
    expect(homeLinkElement).toBeTruthy();
  });
});
