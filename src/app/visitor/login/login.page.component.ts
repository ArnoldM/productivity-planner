import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginUserUseCase } from '@visitor/login/domain/login-user.use-case';

@Component({
  imports: [FormsModule],
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.scss',
})
export default class LoginPageComponent {
  readonly #loginUserUseCase = inject(LoginUserUseCase);

  readonly email = signal<string>('jack.doe@gmail.com2');
  readonly password = signal<string>('Password1$');

  onSubmit() {
    this.#loginUserUseCase.execute(this.email(), this.password());
  }
}
