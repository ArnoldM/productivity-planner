import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationFirebaseService } from '@core/adapters/authentication-firebase.service';
import { EmailAlreadyTakenError } from '@visitor/signup/domain/email-already-taken.error';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';

export type RegisterResponse = RegisterPayload | EmailAlreadyTakenError;
export type LoginResponse = LoginPayload | InvalidCredentialError;

export interface LoginPayload {
  jwtToken: string;
  jwtRefreshToken: string;
  expiresIn: string;
  userId: string;
  isRegistered: boolean;
}

export interface RegisterPayload {
  jwtToken: string;
  jwtRefreshToken: string;
  expiresIn: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
  useClass: AuthenticationFirebaseService,
})
export abstract class AuthenticationService {
  abstract register(email: string, password: string): Observable<RegisterResponse>;

  abstract login(email: string, password: string): Observable<LoginResponse>;
}
