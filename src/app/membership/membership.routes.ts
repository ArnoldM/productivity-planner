import DashboardPageComponent from '@membership/dashboard/dashboard.page.component';
import PlanningPageComponent from '@membership/planning/planning.page.component';
import { Routes } from '@angular/router';
import ProfilePageComponent from '@membership/profile/profile.page.component';
import WorkdayPageComponent from '@membership/workday/workday.page.component';
import SettingsPageComponent from '@membership/settings/settings.page.component';

const membershipRoutes: Routes = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'planning',
    title: 'Planning',
    component: PlanningPageComponent,
  },
  {
    path: 'workday',
    title: 'Workday',
    component: WorkdayPageComponent,
  },
  {
    path: 'profile',
    title: 'Profile',
    component: ProfilePageComponent,
  },
  {
    path: 'settings',
    title: 'Settings',
    component: SettingsPageComponent,
  },
];

export default membershipRoutes;
