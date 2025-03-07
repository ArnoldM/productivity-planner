import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '@core/services/authentication.service';
import { UserStore } from '@core/stores/user.store';
import { Visitor } from '@core/entities/user.interface';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.page.component.html',
  styleUrl: './signup.page.component.scss',
})
export default class SignupPageComponent {
  readonly userStore = inject(UserStore);
  readonly authenticationService = inject(AuthenticationService);

  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');

  readonly isPasswordMatchValid = computed(() => this.password() === this.confirmPassword());

  onSubmit() {
    console.log('Submitted');
    const user: Visitor = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
    };

    this.userStore.register(user);
  }
}
