import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {
  AuthenticationService,
  LoginResponse,
  RegisterResponse,
} from '@core/ports/authentication.service';
import { EmailAlreadyTakenError } from '@visitor/signup/domain/email-already-taken.error';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';

interface FirebaseResponseSignin {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

interface FirebaseResponseSignup {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable()
export class AuthenticationFirebaseService implements AuthenticationService {
  readonly #http = inject(HttpClient);

  register(email: string, password: string): Observable<RegisterResponse> {
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`;
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.#http.post<FirebaseResponseSignup>(URL, payload).pipe(
      map((response): RegisterResponse => {
        return {
          jwtToken: response.idToken,
          jwtRefreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
          userId: response.localId,
        };
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error.error.message === 'EMAIL_EXISTS') {
          return of(new EmailAlreadyTakenError(email));
        }

        return throwError(() => new Error(error.message));
      }),
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.#http.post<FirebaseResponseSignin>(URL, payload).pipe(
      map(
        (response): LoginResponse => ({
          jwtToken: response.idToken,
          jwtRefreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
          userId: response.localId,
          isRegistered: response.registered,
        }),
      ),
      catchError((error: HttpErrorResponse) => {
        if (error.error?.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
          return of(new InvalidCredentialError());
        }

        return throwError(() => new Error(error.message));
      }),
    );
  }
}
