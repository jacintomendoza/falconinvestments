import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AccountService } from '../account.service';
import { User } from '../user.model';
import { Account } from '../account.model';
import { switchMap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { UserStoreService } from '../user-store.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  emailRegx =
    /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  isLoadingAuth: boolean = false;
  userResponse: any = null;
  newUser: User = { id: 0, firstName: '', lastName: '', email: '' };
  accountUser: any = { id: 0, name: '', age: 0, password: '' };
  newAccount: Account = {
    id: 0,
    label: '',
    balance: 0,
    annualContribution: 0,
    userId: 2,
    newUserId: 0,
  };
  newUserId: number = 0;
  title = 'newMat';

  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private userStore: UserStoreService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.userService.loadUsers().subscribe((payload) => {
      this.newUserId = payload.length + 1;
      console.log(this.newUserId);
    });
    if (this.userStore.currentUser && this.userStore.currentUser.email) {
      this.router.navigate(['/dashboard'], {
        state: { redirectMessage: 'You are currently signed in.' },
      });
    }
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailRegx)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      label: ['', Validators.required],
      balance: ['', Validators.required],
      annualContribution: ['', Validators.required],
    });
  }

  submit() {
    this.isLoadingAuth = true;
    this.newUser = this.firstFormGroup.value;
    this.newAccount = this.secondFormGroup.value;
    this.newAccount.userId = 2;
    this.newAccount.newUserId = this.newUserId;

    this.userService.createUser(this.newUser).subscribe((payload) => {
      console.log(payload);
      if (payload.id) {
        this.userService
          .submitSignin({
            email: this.firstFormGroup.value.email,
            password: this.firstFormGroup.value.password,
          })
          .subscribe((response) => {
            this.cookieService.set('falcon.sid', JSON.stringify(response));
            if (response.userId) {
              this.userService.fetchUserDetails(response.userId);
              setTimeout(() => this.router.navigate(['/dashboard']), 3000);
            }
          });
      } else {
        // Error
        this.isLoadingAuth = false;
      }
    });
    this.accountService.createAccount(this.newAccount).subscribe((payload) => {
      console.log(payload);
    });

    // this.router.navigate(['/signin']);
  }
}
