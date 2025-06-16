import { Routes } from '@angular/router';
import { HomePageComponent } from '@visitor/home-page/home-page.component';
import { APP_ROUTES } from '@core/models/enums/routes.enum';
import { ShellLayoutComponent } from '@membership/core/shell/shell.layout.component';

export const routes: Routes = [
  { path: APP_ROUTES.HOME, component: HomePageComponent, title: 'Productivity Planner' },
  {
    path: APP_ROUTES.SIGNUP,
    loadComponent: () => import('./visitor/signup/signup.page.component'),
    title: 'Signup',
  },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () => import('./visitor/login/login.page.component'),
    title: 'Login',
  },
  {
    path: `${APP_ROUTES.APP}`,
    component: ShellLayoutComponent,
    loadChildren: () => import('./membership/membership.routes'),
    title: 'Productivity Planner',
  },
];
