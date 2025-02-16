import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.page.component.html',
  styleUrl: './signup.page.component.scss',
})
export default class SignupPageComponent {
  readonly authenticationService = inject(AuthenticationService);

  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');

  readonly isPasswordMatchValid = computed(() => this.password() === this.confirmPassword());

  onSubmit() {
    console.log('Submitted');
    this.authenticationService.register(this.email(), this.password()).subscribe({
      next: (response) => {
        console.log('Response', response);
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }
}
