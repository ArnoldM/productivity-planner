import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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

interface FirebaseResponseRefreshToken {
  id_token: string;
  user_id: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  project_id: string;
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

  refreshToken(
    jwtRefreshToken: string,
  ): Observable<{ jwtToken: string; userId: string; jwtRefreshToken: string }> {
    const URL = `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseConfig.apiKey}`;
    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', jwtRefreshToken)
      .toString();

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.#http.post<FirebaseResponseRefreshToken>(URL, params, { headers }).pipe(
      map((response) => ({
        jwtRefreshToken: response.refresh_token,
        jwtToken: response.id_token,
        userId: response.user_id,
      })),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message));
      }),
    );
  }
}
