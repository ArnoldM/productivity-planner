import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeAutoConnectFactory } from '@core/initializers/auto-connect.initializer';
import { AuthenticationService } from '@core/ports/authentication.service';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      return initializeAutoConnectFactory(
        inject(AuthenticationService),
        inject(UserService),
        inject(UserStore),
        inject(Router),
      )();
    }),
  ],
};
