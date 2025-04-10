import { ComponentFixture, TestBed } from '@angular/core/testing';

import LoginPageComponent from './login.page.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let email: DebugElement;
  let password: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    email = fixture.debugElement.query(By.css('[data-testid="email"]'));
    password = fixture.debugElement.query(By.css('[data-testid="password"]'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when page loads', () => {
    it('should display email field', () => {
      expect(email).toBeTruthy();
    });
    it('should display password field', () => {
      expect(password).toBeTruthy();
    });
  });

  describe('when user interact with email field', () => {
    it('should not display error message when field is valid', () => {
      email.nativeElement.value = faker.internet.email();
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorRequired = fixture.debugElement.query(
        By.css('[data-testId="error-email-required"]'),
      );
      const errorPattern = fixture.debugElement.query(
        By.css('[data-testId="error-email-pattern"]'),
      );
      expect(errorRequired).toBeFalsy();
      expect(errorPattern).toBeFalsy();
    });

    it('should display error message when field is empty', () => {
      email.nativeElement.value = '';
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-email-required"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Email is required.');
    });

    it('should display error message when field do not contain a valid HTML5 email', () => {
      email.nativeElement.value = 'invalid-email';
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-email-pattern"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Email must be valid.');
    });
  });

  describe('when user interact with password field', () => {
    it('should not display error message when field is valid', () => {
      password.nativeElement.value = 'Password1$';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-required"]'));
      expect(error).toBeFalsy();
    });

    it('should display error message when field is empty', () => {
      password.nativeElement.value = '';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-required"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Password is required.');
    });
  });
});
