import { Component, OnInit, ViewChild } from '@angular/core';
import { MutualFundsService } from '../mutual-funds.service';
import { MutualFund } from './mutual-fund.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FilteredFund } from '../filtered-fund.model';
import { AccountService } from '../account.service';
import { Investment } from '../investment.model';
import { UserStoreService } from '../user-store.service';
import { User } from '../user.model';
import { Account } from '../account.model';

@Component({
  selector: 'app-mutual-funds',
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss'],
})
export class MutualFundsComponent implements OnInit {
  isLoadingFunds: boolean = false;

  filteredFunds: any[] = [];
  filteredFund: any = {
    mf_id: 0,
    fundName: '',
    symbol: '',
    inceptionDate: '',
    expenseRatio: 0,
    nAV: 0,
    isUsed: false,
  };
  dataSource!: MatTableDataSource<FilteredFund[]>;
  investments: any[] = [];
  newInvestment: Investment = {
    name: '',
    type: 'Mutual Fund',
    symbol: '',
    expenseRatio: 0,
    nAV: 0,
    inceptionDate: '',
    accountId: 2,
  };
  userToGreet: User | null = null;
  accounts: Account[] | any = [];
  accountId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatPaginator) dataSource!: MatTableDataSource<FilteredFund[]>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userStore: UserStoreService,
    private mutualFundService: MutualFundsService,
    private accountService: AccountService,
    private _liveAnncouncer: LiveAnnouncer
  ) {}

  mutualFunds: any[] = [];

  ngOnInit(): void {
    this.getInvestments();
    this.isLoadingFunds = true;
    this.mutualFundService.getMutualFunds().subscribe((payload) => {
      this.mutualFunds = payload;
      for (let i = 0; i < this.mutualFunds.length; i++) {
        this.filteredFund = {
          mf_id: 0,
          fundName: '',
          symbol: '',
          inceptionDate: '',
          expenseRatio: 0,
          nAV: 0,
          isUsed: false,
        };
        for (let key in this.mutualFunds[i]) {
          if (this.filteredFund.hasOwnProperty(key)) {
            this.filteredFund[key] = this.mutualFunds[i][key];
          }
        }
        for (let j = 0; j < this.investments.length; j++) {
          if (this.mutualFunds[i].fundName == this.investments[j].name) {
            this.filteredFund.isUsed = true;
          }
        }
        this.filteredFunds.push(this.filteredFund);
        this.isLoadingFunds = false;
      }

      this.dataSource = new MatTableDataSource(this.filteredFunds);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = [
    'fundName',
    'symbol',
    'inceptionDate',
    'expenseRatio',
    'nAV',
    'isUsed',
  ];

  getInvestments(): void {
    this.userStore.currentUser$.subscribe((response) => {
      this.userToGreet = response;
    });
    this.accountService.getAccounts().subscribe((payload) => {
      this.accounts = payload.find((acc: { newUserId: number }) =>
        this.userToGreet
          ? acc.newUserId == this.userToGreet.id
          : acc.newUserId == 99
      );
      this.accountId = this.accounts.id;
      this.investments = this.accounts.investments;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnncouncer.announce(`Sorted${sortState.direction}ending`);
    } else {
      this._liveAnncouncer.announce('Sorting cleared');
    }
  }
  addInvestment(fundId: number) {
    this.newInvestment.accountId = this.accountId;
    for (let [key, value] of Object.entries(
      this.filteredFunds.find((x) => x.mf_id === fundId)
    )) {
      switch (key) {
        case 'fundName':
          this.newInvestment.name = String(value);
          break;
        case 'symbol':
          this.newInvestment.symbol = String(value);
          break;
        case 'expenseRatio':
          this.newInvestment.expenseRatio = Number(value);
          break;
        case 'nAV':
          this.newInvestment.nAV = Number(value);
          break;
        case 'inceptionDate':
          this.newInvestment.inceptionDate = String(value);
          break;
      }
    }
    this.filteredFunds.find((x) => x.mf_id === fundId).isUsed = true;
    this.accountService
      .createInvestment(this.newInvestment)
      .subscribe((data) => {
        if (data) {
          console.log(data);
        }
      });
  }
}
