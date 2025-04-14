import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginUserUseCase {
  execute(email: string, password: string): Promise<void> {}
}
