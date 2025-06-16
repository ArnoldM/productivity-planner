import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '@core/models/enums/routes.enum';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.smart.component.html',
  styleUrl: './sidebar.smart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSmartComponent {
  protected readonly APP_ROUTES = APP_ROUTES;
}
