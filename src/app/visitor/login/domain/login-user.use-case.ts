import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '@core/ports/authentication.service';
import { firstValueFrom } from 'rxjs';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';
import { APP_ROUTES } from '@core/models/enums/routes.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginUserUseCase {
  readonly #authenticationService = inject(AuthenticationService);
  readonly #userService = inject(UserService);
  readonly #userStore = inject(UserStore);
  readonly #router = inject(Router);

  async execute(email: string, password: string): Promise<void> {
    const loginResponse = await firstValueFrom(this.#authenticationService.login(email, password));

    if (loginResponse instanceof InvalidCredentialError) {
      throw loginResponse;
    }

    const { jwtToken, userId } = loginResponse;
    localStorage.setItem('jwtToken', jwtToken);

    const user = await firstValueFrom(this.#userService.fetch(userId, jwtToken));

    this.#userStore.load(user);

    await this.#router.navigate(['/', APP_ROUTES.APP, APP_ROUTES.DASHBOARD]);
  }
}
