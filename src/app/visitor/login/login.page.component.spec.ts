import { ComponentFixture, TestBed } from '@angular/core/testing';

import LoginPageComponent from './login.page.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';
import { LoginUserUseCase } from '@visitor/login/domain/login-user.use-case';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let email: DebugElement;
  let password: DebugElement;
  let button: DebugElement;
  let loginUserUseCaseMock: jest.Mocked<LoginUserUseCase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [{ provide: LoginUserUseCase, useValue: { execute: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    email = fixture.debugElement.query(By.css('[data-testid="email"]'));
    password = fixture.debugElement.query(By.css('[data-testid="password"]'));
    button = fixture.debugElement.query(By.css('[data-testId="submit-button"]'));

    fixture.detectChanges();

    loginUserUseCaseMock = TestBed.inject(LoginUserUseCase) as jest.Mocked<LoginUserUseCase>;
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

  describe('when user submit the form', () => {
    it('should trigger loginUserUseCase.execute and no error message', () => {
      email.nativeElement.value = faker.internet.email();
      email.nativeElement.dispatchEvent(new Event('input'));
      password.nativeElement.value = 'Password1$';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      loginUserUseCaseMock.execute.mockReturnValue(Promise.resolve());
      button.nativeElement.click();
      fixture.detectChanges();

      const credentialsError = fixture.debugElement.query(
        By.css('[data-testId="error-invalid-credentials"]'),
      );

      expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith(
        email.nativeElement.value,
        password.nativeElement.value,
      );
      expect(credentialsError).toBeFalsy();
    });

    it('should display error message when loginUserUseCase.execute fails with InvalidCredentials error', () => {
      email.nativeElement.value = faker.internet.email();
      email.nativeElement.dispatchEvent(new Event('input'));
      password.nativeElement.value = 'Password1$';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      loginUserUseCaseMock.execute.mockReturnValue(Promise.reject(new InvalidCredentialError()));
      button.nativeElement.click();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-invalid-credentials"]'));
      const errorMessage = error.nativeElement.textContent;

      expect(errorMessage).toContain('Invalid credentials. Please check your email and password.');
    });
  });
});
