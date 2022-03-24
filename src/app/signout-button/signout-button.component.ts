import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserStoreService } from '../user-store.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signout-button',
  templateUrl: './signout-button.component.html',
  styleUrls: ['./signout-button.component.scss'],
})
export class SignoutButtonComponent implements OnInit {
  isVisible: boolean = false;

  constructor(
    private userService: UserService,
    private userStore: UserStoreService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const signedInSubscription = this.userStore.currentUser$.subscribe(
      // Necessary to unsubscribe?
      (response) => {
        if (response && response.email) {
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      }
    );
  }

  signOut(): void {
    this.cookieService.delete('falcon.sid');
    const signoutSubscription = this.userService.signUserOut().subscribe(() => {
      if (!this.cookieService.get('falcon.sid')) {
        this.isVisible = false;
        this.userStore.clearCurrentUser();
        // Navigate to home
        signoutSubscription.unsubscribe();
        this.router.navigate(['/']);
      }
    });
  }
}
