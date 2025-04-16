import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { User } from '@core/entities/user.interface';

interface UserState {
  user: User | undefined;
}

const initialState: UserState = {
  user: undefined,
};

export type UserStore = InstanceType<typeof UserStore>;
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>(initialState),
  withComputed((store) => {
    const isGoogleUser = computed<boolean>(() => !!store.user()?.email.endsWith('@google.com'));

    return { isGoogleUser };
  }),
  withMethods((store) => ({
    load(user: User): void {
      patchState(store, { user });
    },
  })),
);
