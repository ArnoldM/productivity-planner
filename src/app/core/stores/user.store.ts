import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Visitor, User } from '@core/entities/user.interface';
import { RegisterUserUseCaseService } from '@core/use-case/register-user.use-case.service';

interface UserState {
  user: User | undefined;
}

const initialState: UserState = {
  user: undefined,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>(initialState),
  withComputed((store) => {
    const isGoogleUser = computed<boolean>(() => !!store.user()?.email.endsWith('@google.com'));

    return { isGoogleUser };
  }),
  withMethods((store, registerUserUseCase = inject(RegisterUserUseCaseService)) => {
    const register = (visitor: Visitor): void => {
      registerUserUseCase.execute(visitor).then((user) => {
        patchState(store, { user });
      });
    };

    return { register };
  }),
);
