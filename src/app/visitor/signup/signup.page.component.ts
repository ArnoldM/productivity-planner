import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Visitor } from '@core/entities/user.interface';
import { RegisterUserUseCase } from './domain/register-user.use-case';
import { EmailAlreadyTakenError } from './domain/email-already-taken.error';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.page.component.html',
  styleUrl: './signup.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupPageComponent {
  readonly #registerUserUseCase = inject(RegisterUserUseCase);

  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly isEmailAlreadyTaken = signal<boolean>(false);
  readonly emailAlreadyTakenError = signal<string | null>(null);
  readonly isPasswordMatchValid = computed(() => this.password() === this.confirmPassword());

  onSubmit() {
    this.isLoading.set(true);

    const visitor: Visitor = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
    };

    this.#registerUserUseCase.execute(visitor).catch((error) => {
      this.isLoading.set(false);

      if (error instanceof EmailAlreadyTakenError) {
        this.isEmailAlreadyTaken.set(true);
        this.emailAlreadyTakenError.set(error.message);
      } else {
        console.error('Error during registration:', error);
      }
    });
  }

  onEmailChange() {
    this.isEmailAlreadyTaken.set(false);
    this.emailAlreadyTakenError.set(null);
  }
}
