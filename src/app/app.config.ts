import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeAutoConnectFactory } from '@core/initializers/auto-connect.initializer';
import { AuthenticationService } from '@core/ports/authentication.service';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      return initializeAutoConnectFactory(
        inject(AuthenticationService),
        inject(UserService),
        inject(UserStore),
      )();
    }),
  ],
};
