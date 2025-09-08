import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginUserUseCase } from '@visitor/login/domain/login-user.use-case';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';

@Component({
  imports: [FormsModule],
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPageComponent {
  readonly #loginUserUseCase = inject(LoginUserUseCase);

  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly isInvalidCredential = signal<boolean>(true);
  readonly invalidCredentialError = signal<string | null>(null);

  onSubmit() {
    this.isLoading.set(true);

    this.#loginUserUseCase.execute(this.email(), this.password()).catch((error) => {
      this.isLoading.set(false);

      if (error instanceof InvalidCredentialError) {
        this.isInvalidCredential.set(true);
        this.invalidCredentialError.set(error.message);
      } else {
        console.error('Error during login:', error);
      }
    });
  }

  onChange() {
    this.invalidCredentialError.set(null);
    this.isInvalidCredential.set(false);
  }
}
