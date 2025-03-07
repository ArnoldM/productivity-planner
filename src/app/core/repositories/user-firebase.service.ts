import { inject, Injectable } from '@angular/core';
import { ignoreElements, Observable } from 'rxjs';
import { UserService } from '@core/repositories/user.service';
import { User } from '@core/entities/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserFirebaseService implements UserService {
  readonly #http = inject(HttpClient);

  readonly #FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${environment.firebaseConfig.projectId}/databases/(default)/documents`;
  readonly #USER_COLLECTION_ID = 'users';
  readonly #FIREBASE_API_KEY = environment.firebaseConfig.apiKey;
  readonly #USER_COLLECTION_URL = `${this.#FIRESTORE_URL}/${this.#USER_COLLECTION_ID}?key=${this.#FIREBASE_API_KEY}`;

  create(user: User, bearerToken: string): Observable<void> {
    const url = `${this.#USER_COLLECTION_URL}&documentId=${user.id}`;
    const payload = {
      fields: {
        name: { stringValue: user.name },
        email: { stringValue: user.email },
      },
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });
    const options = { headers };

    return this.#http.post<unknown>(url, payload, options).pipe(ignoreElements());
  }
}
