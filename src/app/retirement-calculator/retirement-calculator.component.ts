import { Component, OnInit } from '@angular/core';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { UserStoreService } from '../user-store.service';
import { User } from '../user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-retirement-calculator',
  templateUrl: './retirement-calculator.component.html',
  styleUrls: ['./retirement-calculator.component.scss']
})
export class RetirementCalculatorComponent implements OnInit {

  userToGreet: User | null = null;
  accounts: Account[] | any = [];
  calcForm!: FormGroup;
  years: number = 0;
  total: number = 0;

  constructor(private userStore: UserStoreService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.userStore.currentUser$.subscribe((response) => {
      this.userToGreet = response;
    });
    this.accountService.getAccounts().subscribe((payload) => {
      this.accounts = payload.find((acc: { newUserId: number }) =>
        this.userToGreet
          ? acc.newUserId == this.userToGreet.id
          : acc.newUserId == 99
      );
    });
    this.calcForm = this.formBuilder.group({
      balance: [null],
      annualContribution: [null],
      age: [null, Validators.required],
      returnRate: [null, Validators.required],
      taxRate: [null, Validators.required],
    });
  }

onSubmit() {
const principal = this.calcForm.value.balance ? this.calcForm.value.balance : this.accounts.balance;
const rate = this.calcForm.value.returnRate;
this.years = 65 - this.calcForm.value.age;
const annual = this.calcForm.value.annualContribution ? this.calcForm.value.annualContribution : this.accounts.annualContribution;
const tax = this.calcForm.value.taxRate;
this.total = (principal*(1+rate)**(this.years))+(annual*((1+rate)**(this.years)-1)*(1+rate))/rate
this.total = this.total - (this.total * tax);
console.log(principal, rate, this.years, annual)
console.log(this.total)
}

}
