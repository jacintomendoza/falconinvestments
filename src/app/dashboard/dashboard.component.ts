import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Account } from '../account.model';
import { Investment } from '../investment.model';
import { UserStoreService } from '../user-store.service';
import { User } from '../user.model';
import { Certificate } from '../certificate.model';
import { CertificateService } from '../certificate.service';
import { StocksService } from '../stock.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const { DateTime } = require('luxon');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  redirectMessage: string | null = null;
  isLoadingUser: boolean = false;
  isLoadingAccounts: boolean = false;
  isLoadingCertificates: boolean = false;
  userToGreet: User | null = null;
  accounts: Account[] | any = [];
  investments: Investment[] = [];
  users: User[] = [];
  certificates: Certificate[] = [];
  stocks: any[] = [];
  constructor(
    private userStore: UserStoreService,
    private accountService: AccountService,
    private certificateService: CertificateService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private stocksService:StocksService
  ) {}

  private stateCertsSubscription: any;

  ngOnInit(): void {
    if (window.history.state.redirectMessage) {
      this._snackBar.open(window.history.state.redirectMessage, 'OK', {
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['snackbar']
      });
    }
    this.userStore.currentUser$.subscribe((response) => {
      this.isLoadingUser = true;
      if (!response) {
        this.isLoadingUser = false;
      } else {
        this.userToGreet = response;
        this.certificateService.fetchUserCertificates(response.id);
        this.isLoadingUser = false;
      }
    });
    this.accountService.getAccounts().subscribe((payload) => {
      this.isLoadingAccounts = true;
      this.accounts = payload.find((acc: { newUserId: number }) =>
      this.userToGreet
      ? acc.newUserId == this.userToGreet.id
      : acc.newUserId == 99
      );
      this.investments = this.accounts.investments;
      this.isLoadingAccounts = false;
    });
    this.stateCertsSubscription =
    this.certificateService.userCertificates$.subscribe((certificates) => {
      this.isLoadingCertificates = true;
      if (certificates.length === 0) {
        this.isLoadingCertificates = false;
        this.stateCertsSubscription.unsubscribe();
      }
      if (certificates.length > 0) {
        this.certificates = certificates;
        this.stateCertsSubscription.unsubscribe();
        this.isLoadingCertificates = false;
      }
      if (!this.userToGreet) {
        this.isLoadingCertificates = false;
          this.isLoadingUser = false;
        }
      });
    if (!this.userToGreet && !this.isLoadingUser) {
      this.router.navigate(['/signin'], {
        state: { redirectMessage: 'Please sign in to view your dashboard.' },
      });
    }
    this.displayStocks();
  }

  ngOnDestroy(): void {
    this.stateCertsSubscription.unsubscribe();
  }

  deleteInvestment(id: number | undefined, index: number) {
    this.accountService.deleteInvestment(id).subscribe();
    this.investments.splice(index, 1);
  }

  convertDatesToMonths(start: Date, end: Date) {
    const startDate = DateTime.fromISO(start);
    const endDate = DateTime.fromISO(end);
    return endDate.diff(startDate, 'months').values.months;
  }

  calcTimeRemaining(end: Date) {
    const startDate = DateTime.fromJSDate(new Date());
    const endDate = DateTime.fromISO(end);

    return endDate
      .diff(startDate, ['years', 'months'])
      .toHuman({ floor: true });
  }
  deleteStock(id: number | undefined, index: number) {
    this.stocksService.deleteUserStock(id).subscribe();
    this.stocks.splice(index, 1);
  }


  
  displayStocks(){
    this.stocksService.getUserStocks().subscribe((payload) => {
      // console.log(payload)
      this.stocks = payload.filter((stock: { accountId: any; isPurchased: boolean }) => stock.accountId === this.accounts.id && stock.isPurchased == true)
      // console.log(this.stocks)
      this.stocks.sort((a, b) => {
        let fa = a.symbol.toLowerCase();
        let fb = b.symbol.toLowerCase();
        if(fa<fb) {
          return -1
        }
        if (fa >fb) {
          return 1
        }
        return 0
      })
      for(let i =0; i<this.stocks.length; i++) {
        if(this.stocks[i].symbol === this.stocks[i+1].symbol){
          this.stocks[i].quantity += this.stocks[i+1].quantity
          this.stocksService.deleteUserStock(this.stocks[i+1].id).subscribe()
          this.stocks.splice(i + 1, 1)
          this.stocksService.updateUserStock(this.stocks[i]).subscribe()
        }
      }
      this.stocks.forEach(stock => {
        console.log(`${stock.symbol}`)
      }
        )
    });
  }
}
