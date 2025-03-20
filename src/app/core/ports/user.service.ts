import { Injectable } from '@angular/core';
import { User } from '@core/entities/user.interface';
import { Observable } from 'rxjs';
import { UserFirebaseService } from '@core/adapters/user-firebase.service';

@Injectable({
  providedIn: 'root',
  useClass: UserFirebaseService,
})
export abstract class UserService {
  abstract create(user: User, bearerToken: string): Observable<void>;
  // fetch(user: User): Observable<void> {}
  // delete(user: User): Observable<void> {}
  // update(user: User): Observable<void> {}
}
