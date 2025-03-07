import { inject, Injectable } from '@angular/core';
import { User, Visitor } from '@core/entities/user.interface';
import { AuthenticationService } from '@core/services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@core/repositories/user.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserUseCaseService {
  readonly #authenticationService = inject(AuthenticationService);
  readonly #userService = inject(UserService);

  async execute(visitor: Visitor): Promise<User> {
    const response = await firstValueFrom(
      this.#authenticationService.register(visitor.email, visitor.password),
    );

    localStorage.setItem('jwtToken', response.jwtToken);
    localStorage.setItem('jwtRefreshToken', response.jwtRefreshToken);
    localStorage.setItem('expiresIn', response.expiresIn);

    const user: User = {
      id: response.userId,
      email: visitor.email,
      name: visitor.name,
    };

    await firstValueFrom(this.#userService.create(user, response.jwtToken));

    return user;
  }
}
