import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/authentication.service';
import { FirebaseResponseSignup } from '@core/models/interfaces/firebase-response-signup.interface';
import { FirebaseResponseSignin } from '@core/models/interfaces/firebase-response-signin.interface';
import { RegisterResponse } from '@core/models/interfaces/register-response.interface';
import { LoginResponse } from '@core/models/interfaces/login-response.interface';

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
      map(
        (response): RegisterResponse => ({
          jwtToken: response.idToken,
          jwtRefreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
          userId: response.localId,
        }),
      ),
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
    );
  }
}
