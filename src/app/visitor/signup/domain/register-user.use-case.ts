import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '@core/ports/authentication.service';
import { User, Visitor } from '@core/entities/user.interface';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';
import { EmailAlreadyTakenError } from './email-already-taken.error';
import { APP_ROUTES } from '@core/models/enums/routes.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserUseCase {
  readonly #authenticationService = inject(AuthenticationService);
  readonly #userService = inject(UserService);
  readonly #userStore = inject(UserStore);
  readonly #router = inject(Router);

  async execute(visitor: Visitor): Promise<void> {
    const { email, password, name } = visitor;
    const registerResponse = await firstValueFrom(
      this.#authenticationService.register(email, password),
    );

    if (registerResponse instanceof EmailAlreadyTakenError) {
      throw registerResponse;
    }

    const { userId, jwtToken } = registerResponse;

    localStorage.setItem('jwtToken', jwtToken);

    const user: User = {
      id: userId,
      email,
      name,
    };
    await firstValueFrom(this.#userService.create(user, registerResponse.jwtToken));

    this.#userStore.load(user);

    await this.#router.navigate(['/', APP_ROUTES.DASHBOARD]);
  }
}
