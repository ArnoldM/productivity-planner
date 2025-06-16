import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarSmartComponent } from '@membership/core/sidebar/sidebar.smart.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarSmartComponent],
  templateUrl: './shell.layout.component.html',
  styleUrl: './shell.layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell d-flex vh-100',
  },
})
export class ShellLayoutComponent {}
