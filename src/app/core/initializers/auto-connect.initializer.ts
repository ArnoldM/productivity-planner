import { AuthenticationService } from '@core/ports/authentication.service';
import { switchMap, tap } from 'rxjs';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';
import { Router } from '@angular/router';

export function initializeAutoConnectFactory(
  authenticationService: AuthenticationService,
  userService: UserService,
  userStore: UserStore,
): () => Promise<void> {
  return () =>
    new Promise((resolve, reject) => {
      const jwtRefreshToken = localStorage.getItem('jwtRefreshToken');

      if (!jwtRefreshToken) {
        resolve();
      }

      authenticationService
        .refreshToken(jwtRefreshToken!)
        .pipe(
          tap(({ jwtToken, jwtRefreshToken }) => {
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('jwtRefreshToken', jwtRefreshToken);
          }),
          switchMap(({ userId, jwtToken }) => userService.fetch(userId, jwtToken)),
        )
        .subscribe({
          next: (user) => {
            userStore.load(user);
            resolve();
          },
          error: (error) => {
            console.error('Error during auto-connect:', error);
            reject(error);
          },
        });
    });
}
