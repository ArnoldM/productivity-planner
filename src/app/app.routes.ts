import { Routes } from '@angular/router';
import { HomePageComponent } from './visitor/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Homepage' },
];
