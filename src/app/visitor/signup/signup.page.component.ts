import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.page.component.html',
  styleUrl: './signup.page.component.scss',
})
export default class SignupPageComponent {
  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');

  readonly isPasswordMatchValid = computed(() => this.password() === this.confirmPassword());

  onSubmit() {
    console.log('Name', this.name());
    console.log('Email', this.email());
    console.log('password', this.password());
  }
}
