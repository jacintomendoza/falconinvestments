import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from './user.model';

export interface UserState {
  isSignedIn: boolean;
  currentUser: User | null;
}

const initialState: UserState = {
  isSignedIn: false,
  currentUser: null,
};

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private readonly store$ = new BehaviorSubject<UserState>(initialState);

  readonly currentUser$ = this.store$.pipe(map((state) => state.currentUser));

  constructor() {}

  get currentUser(): User | null {
    return this.store$.value.currentUser;
  }

  setCurrentUser(user: User) {
    this.store$.next({
      ...this.store$.value,
      currentUser: user,
    });
  }

  clearCurrentUser() {
    this.store$.next({
      ...this.store$.value,
      currentUser: null,
    });
  }
}
