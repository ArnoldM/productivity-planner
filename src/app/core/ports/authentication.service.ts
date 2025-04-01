import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterResponse } from '@core/models/interfaces/register-response.interface';
import { LoginResponse } from '@core/models/interfaces/login-response.interface';
import { AuthenticationFirebaseService } from '@core/adapters/authentication-firebase.service';

@Injectable({
  providedIn: 'root',
  useClass: AuthenticationFirebaseService,
})
export abstract class AuthenticationService {
  abstract register(email: string, password: string): Observable<RegisterResponse>;

  abstract login(email: string, password: string): Observable<LoginResponse>;
}
