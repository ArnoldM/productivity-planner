import { Routes } from '@angular/router';
import { HomePageComponent } from './visitor/home-page/home-page.component';
import { APP_ROUTES } from '@core/enums/routes.enum';

export const routes: Routes = [
  { path: APP_ROUTES.HOME, component: HomePageComponent, title: 'Homepage' },
  {
    path: APP_ROUTES.SIGNUP,
    loadComponent: () => import('./visitor/signup/signup.page.component'),
    title: 'Signup',
  },
];
