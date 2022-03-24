import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserStoreService } from './user-store.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'capstone-frontend';

  constructor(
    private cookieService: CookieService,
    private userStore: UserStoreService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userStore.currentUser$.subscribe((user) => {
      if (!user) {
        let cookie = this.cookieService.get('falcon.sid');
        if (cookie) {
          this.userService.fetchUserDetails(JSON.parse(cookie).userId);
        }
      }
    });
  }
}
