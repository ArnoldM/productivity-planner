import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '@core/ports/authentication.service';
import { firstValueFrom } from 'rxjs';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';
import { UserService } from '@core/ports/user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginUserUseCase {
  readonly #authenticationService = inject(AuthenticationService);
  readonly #userService = inject(UserService);

  async execute(email: string, password: string): Promise<void> {
    const loginResponse = await firstValueFrom(this.#authenticationService.login(email, password));

    if (loginResponse instanceof InvalidCredentialError) {
      throw loginResponse;
    }

    const { jwtToken, userId } = loginResponse;
    localStorage.setItem('jwtToken', jwtToken);

    const user = await firstValueFrom(this.#userService.fetch(userId, jwtToken));
  }
}
