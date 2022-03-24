import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserStoreService } from '../user-store.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  credentialsAreValid: boolean | null = null;
  redirectMessage: string | null = null;
  isLoadingAuth: boolean = false;
  loginForm!: FormGroup;
  emailRegx =
    /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.userStore.currentUser && this.userStore.currentUser.email) {
      this.router.navigate(['/dashboard'], {
        state: { redirectMessage: 'You are already signed in.' },
      });
    }
    if (window.history.state.redirectMessage) {
      this._snackBar.open(window.history.state.redirectMessage, 'OK', {
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['snackbar']
      });
    }
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required],
    });
  }

  onSubmit() {
    const signinSubscription = this.userService
      .submitSignin(this.loginForm.value)
      .subscribe({
        next: (response) => {
          this.cookieService.set('falcon.sid', JSON.stringify(response));
          if (response.userId) {
            this.credentialsAreValid = true;
            this.userService.fetchUserDetails(response.userId);
            signinSubscription.unsubscribe();
            this.isLoadingAuth = true;
            setTimeout(() => this.router.navigate(['/dashboard']), 1000); // Timeout to prevent automatic re-redirection to /signin
          }
        },
        error: (error) => {
          if (error.status === 400 || error.status === 404) {
            this.credentialsAreValid = false;
          }
        },
      });
  }
}
