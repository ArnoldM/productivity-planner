import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from './core/authentication.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #authenticationService = inject(AuthenticationService);

  onLogin() {
    this.#authenticationService
      .login('john.doe@gmail.com', 'qwertz')
      .pipe(
        switchMap((response) => {
          const { email, localId, idToken } = response;
          return this.#authenticationService.save(email, localId, idToken);
        }),
      )
      .subscribe();
  }
}
