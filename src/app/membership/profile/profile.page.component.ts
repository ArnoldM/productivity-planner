import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.page.component.html',
  styleUrl: './profile.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent {}
