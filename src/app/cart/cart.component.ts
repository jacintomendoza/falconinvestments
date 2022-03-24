import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../account.service';
import { StocksService } from '../stock.service';
import { StocksComponent } from '../stocks/stocks.component';
import { Account } from '../account.model';
import { Stock } from '../stock.model';
import { UserStoreService } from '../user-store.service';
import { User } from '../user.model';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { count } from 'console';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import { PurchaseConfirmationDialogComponent } from '../purchase-confirmation-dialog/purchase-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  initialCount: number = 1;

@Input()

userToGreet: User | null= null;  
accounts: Account[] | any = [];
  stocks:any[] = [];
  users: User[] = [];
  filteredStocks: any[] = [];
  account: any = {}
  accountId: number = 0; 
  sessionId: number = 0;
  counter: any[] = []
  cartData: any[] = []


  constructor(
    private userStore: UserStoreService,
    private accountService: AccountService,
    private stocksService: StocksService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getSessionId()
    this.getAccountId()
    this.userStore.currentUser$.subscribe((response) => {
      this.userToGreet = response;
    });
    this.stocksService.getUserStocks().subscribe(payload =>{
      
    })
    this.calculateTotal()
  }
  

  getSessionId(): void {
    this.stocksService.getUserStocks().subscribe((payload) => {

      this.sessionId = payload
      .filter( (x: { accountId: number; }) => x.accountId === this.accountId )
      .reduce((prev: { sessionId: number; }, current: { sessionId: number; }) => (prev.sessionId > current.sessionId) ? prev : current, 0).sessionId
      //this.sessionId = payload.sessionId;
      // console.log(this.sessionId)
      this.stocks = payload.filter( (x: { accountId: number, sessionId: number; }) => x.accountId === this.accountId && x.sessionId === this.sessionId)
      
        this.stocks.forEach(() => this.counter.push(1))
      // console.log(this.stocks)
    })
  }


  getAccountId(): void {
    this.userStore.currentUser$.subscribe((response) => {
      // console.log(response)
       this.userToGreet = response;
    });
    this.accountService.getAccounts().subscribe(payload =>{
      this.account = payload.find((acc: { newUserId: number; }) => this.userToGreet ? acc.newUserId == this.userToGreet.id : acc.newUserId == 99);
      this.accountId = this.account.id;
      // console.log(this.accountId)
    })
    
  }

  removeDuplicates(): any {
    this.stocks.forEach((item) => {
      if(this.stocks.indexOf(item < 0)) {
        // console.log(item)
        this.filteredStocks.push(item)
        // console.log(this.filteredStocks)
        // console.log(this.stocks)
      }

      return this.stocks
    })
}

  deleteStock(id: number | undefined, index: number) {
    this.stocksService.deleteUserStock(id).subscribe();
    this.stocks.splice(index, 1);
  }

  calculateTotal(){
    let total = 0
    if(this.stocks){

      for(let i = 0; i<this.stocks.length; i++) {
        total = total +  (this.stocks[i].price * this.counter[i])
      };

    }
    console.log(this.counter)
    return total
  }


  
purchase(){
  
  const dialogRef = this.dialog.open(PurchaseConfirmationDialogComponent);
  for(let i =0; i<this.counter.length; i++){
    this.stocks[i].quantity = this.stocks[i].quantity * this.counter[i]
    this.stocks.forEach(stock =>
      {
        console.log(stock)
        // stock.quantity = stock.quantity * this.counter[i]; 
        stock.isPurchased = true
        this.stocksService.updateUserStock(stock).subscribe(payload => console.log(payload))
      })
   dialogRef.afterClosed().subscribe((result) => {
     if(result===true) {

        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
     }

   })
  }
}

toStock(){
  location.assign("localhost:4200/stocks")
}
}
