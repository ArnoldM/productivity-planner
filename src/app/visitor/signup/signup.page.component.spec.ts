import { ComponentFixture, TestBed } from '@angular/core/testing';

import SignupPageComponent from './signup.page.component';
import { UserStore } from '@core/stores/user.store';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { faker } from '@faker-js/faker';

describe('SignupPageComponent', () => {
  let component: SignupPageComponent;
  let fixture: ComponentFixture<SignupPageComponent>;
  let name: DebugElement;
  let email: DebugElement;
  let password: DebugElement;
  let confirmPassword: DebugElement;
  let button: DebugElement;
  let form: DebugElement;
  let userStoreMock: { register: jest.Mock };

  beforeEach(async () => {
    userStoreMock = {
      register: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SignupPageComponent],
      providers: [{ provide: UserStore, useValue: userStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    name = fixture.debugElement.query(By.css('[data-testId="name"]'));
    email = fixture.debugElement.query(By.css('[data-testId="email"]'));
    password = fixture.debugElement.query(By.css('[data-testId="password"]'));
    confirmPassword = fixture.debugElement.query(By.css('[data-testId="confirm-password"]'));
    button = fixture.debugElement.query(By.css('[data-testId="submit-button"]'));
    form = fixture.debugElement.query(By.css('[data-testId="form"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when page load', () => {
    it('should display fields name, email, password and confirm password', () => {
      expect(name).toBeTruthy();
      expect(email).toBeTruthy();
      expect(password).toBeTruthy();
      expect(confirmPassword).toBeTruthy();
    });
    it('should display a submit button', () => {
      expect(button).toBeTruthy();
    });
  });

  describe('when user interact with name field', () => {
    it('should display error message when field is empty', () => {
      name.nativeElement.value = '';
      name.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-name-required"]'));
      const errorMessage = error.nativeElement.textContent;

      expect(errorMessage).toContain('Name is required');
    });

    it('should display error message when field contain less than 3 characters', () => {
      name.nativeElement.value = 'aa';
      name.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-name-minlength"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Name must contain at least 3 characters');
    });

    it('should display error message when field contain more than 20 characters', () => {
      name.nativeElement.value = 'a'.repeat(21);
      name.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-name-maxlength"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Name must contain maximum 20 characters');
    });
    it('should display error message when field do not contain only letters', () => {
      name.nativeElement.value = '123';
      name.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-name-pattern"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Name must contain only letters');
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
      expect(errorMessage).toContain('Email is not valid.');
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
    it('should display error message when field contain less than 8 characters', () => {
      password.nativeElement.value = '1234567';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-minlength"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Password must contain at least 8 characters');
    });
    it('should display error message when field do not contain at least 1 uppercase character', () => {
      password.nativeElement.value = 'abc1$def';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-pattern"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toBeTruthy();
    });
    it('should display error message when field do not contain at least 1 lowercase character', () => {
      password.nativeElement.value = 'ABC1$DEF';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-pattern"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toBeTruthy();
    });
    it('should display error message when field do not contain at least 1 number', () => {
      password.nativeElement.value = 'ABCa$DEF';
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-pattern"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toBeTruthy();
    });
  });

  describe('when user interact with "confirm password" field', () => {
    it('should display error message when field do not have same value as password field', () => {
      password.nativeElement.value = 'Password1$';
      password.nativeElement.dispatchEvent(new Event('input'));
      confirmPassword.nativeElement.value = 'Password2$';
      confirmPassword.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('[data-testId="error-password-confirm"]'));
      const errorMessage = error.nativeElement.textContent;
      expect(errorMessage).toContain('Passwords do not match.');
    });
  });

  describe('when user submit the form', () => {
    it('should trigger userStore Register', () => {
      name.nativeElement.value = faker.person.lastName();
      name.nativeElement.dispatchEvent(new Event('input'));
      email.nativeElement.value = faker.internet.email();
      email.nativeElement.dispatchEvent(new Event('input'));
      password.nativeElement.value = 'Password1$';
      password.nativeElement.dispatchEvent(new Event('input'));
      confirmPassword.nativeElement.value = 'Password1$';
      confirmPassword.nativeElement.dispatchEvent(new Event('input'));
      // don't forget this !!!
      fixture.detectChanges();

      button.nativeElement.click();

      expect(userStoreMock.register).toHaveBeenCalled();
    });
  });
});
