import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

/**
 * Represents the payload of the response received when registering a new user in Firebase
 * @see https://firebase.google.com/docs/reference/rest/auth?hl=fr#section-create-email-password
 */
interface FirebaseResponseSignup {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

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

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  readonly #http = inject(HttpClient);

  register(
    email: string,
    password: string,
  ): Observable<FirebaseResponseSignup> {
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`;
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.#http.post<FirebaseResponseSignup>(URL, payload);
  }

  login(email: string, password: string): Observable<FirebaseResponseSignin> {
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.#http.post<FirebaseResponseSignin>(URL, payload);
  }

  save(
    email: string,
    userId: string,
    bearerToken: string,
  ): Observable<unknown> {
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${environment.firebaseConfig.projectId}/databases/(default)/documents`;
    const userFirestoreCollectionId = 'users';
    const url = `${baseUrl}/${userFirestoreCollectionId}?documentId=${userId}`;
    const payload = {
      fields: {
        id: { stringValue: userId },
        email: { stringValue: email },
      },
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });
    const options = { headers };

    return this.#http.post<unknown>(url, payload, options);
  }
}
