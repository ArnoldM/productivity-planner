import { Routes } from '@angular/router';
import { HomePageComponent } from '@visitor/home-page/home-page.component';
import { APP_ROUTES } from '@core/models/enums/routes.enum';

export const routes: Routes = [
  { path: APP_ROUTES.HOME, component: HomePageComponent, title: 'Homepage' },
  {
    path: APP_ROUTES.SIGNUP,
    loadComponent: () => import('./visitor/signup/signup.page.component'),
    title: 'Signup',
  },
  {
    path: `${APP_ROUTES.APP}/${APP_ROUTES.DASHBOARD}`,
    loadComponent: () => import('./membership/dashboard/dashboard.page.component'),
    title: 'Dashboard',
  },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () => import('./visitor/login/login.page.component'),
    title: 'Login',
  },
];
