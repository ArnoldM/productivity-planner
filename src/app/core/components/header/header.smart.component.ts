import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '@core/enums/routes.enum';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.smart.component.html',
  styleUrl: './header.smart.component.scss',
})
export class HeaderComponent {
  readonly APP_ROUTES = APP_ROUTES;
}
