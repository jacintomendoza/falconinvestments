import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { UserStoreService } from './user-store.service';
import { User } from './user.model';

const baseUrl = 'https://falconinvestments.herokuapp.com';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private userStore: UserStoreService) {}

  createUser(newUser: User): Observable<User> {
    return this.http.post<User>(baseUrl + '/signup', newUser);
  }

  submitSignin(formValues: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(baseUrl + '/signin', formValues);
  }

  fetchUserDetails(userId: number) {
    const fetchUserSubscription = this.http
      .get(baseUrl + '/users/' + userId.toString())
      .subscribe((response: any) => {
        if (response.email) {
          this.userStore.setCurrentUser(response);
          fetchUserSubscription.unsubscribe();
        }
      });
  }

  signUserOut(): Observable<any> {
    return this.http.get(baseUrl + '/signout');
  }

  getUsers(): Observable<any> {
    return this.http.get(baseUrl + '/users');
  }
  loadUsers(): Observable<any> {
    return this.http.get(baseUrl + '/users');
  }
}
