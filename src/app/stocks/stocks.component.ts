
import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { StocksService } from "../stock.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Stock } from '../stock.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AccountService } from '../account.service';
import { UserStoreService } from '../user-store.service';
import { User } from '../user.model';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent implements OnInit {
  isLoadingStocks: boolean = false;
  cartData:any[] =[];
  stocks:any[] = [];
  name:any;
  newStock: any = {id: 0, name: '', symbol: '',price: 0, accountId: 0, sessionId: 0, quantity:0, isPurchased: false};
  filteredStocks: any[] = []
  filteredStock: any = {id: 0, name: '', symbol: '',price: 0, isUsed: false};
  dataSource!: MatTableDataSource<any[]>;
  accountId: number = 0;
  userToGreet: User | null= null; 
  account: any = {}
  sessionId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatPaginator) dataSource!: MatTableDataSource<Stock>;
  @ViewChild(MatSort) sort!: MatSort;

constructor(private stocksService: StocksService,
              private _liveAnncouncer: LiveAnnouncer,
              private accountService: AccountService,
              private userStore: UserStoreService,
              private route: ActivatedRoute,) {}


  ngOnInit(): void {
   this.getAccountId();
   this.getSessionId();
    this.stocksService.getStocks().subscribe(payload => {
      this.isLoadingStocks = true;
      this.stocks = payload;
      for (let i = 0; i < this.stocks.length; i++) {
        this.filteredStock = {id: 0, name: '', symbol: '', price: 0, isUsed: false }
        for (let key in this.stocks[i]) {
          if (this.filteredStock.hasOwnProperty(key)) {
            this.filteredStock[key] = this.stocks[i][key]
          }
        }
        this.filteredStocks.push(this.filteredStock)
      }
      console.log(this.filteredStocks)
      this.dataSource = new MatTableDataSource(this.filteredStocks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingStocks = false;
    });
  }
  
  displayedColumns: string[] = ['stockname', 'symbol', 'price', "isUsed"];
  
  getSessionId(): void {
    this.stocksService.getUserStocks().subscribe((payload) => {
      console.log(payload)
      payload = payload
      .filter( (x: { accountId: number; }) => x.accountId === this.accountId )
      .reduce((prev: { sessionId: number; }, current: { sessionId: number; }) => (prev.sessionId > current.sessionId) ? prev : current, 0)
      if(!payload){
        this.sessionId = 1
      } else {
        this.sessionId = payload.sessionId + 1  

      }
      console.log(this.sessionId)
      console.log(payload)
    })
  }


  getAccountId(): void {
    this.userStore.currentUser$.subscribe((response) => {
      console.log(response)
       this.userToGreet = response;
    });
    this.accountService.getAccounts().subscribe(payload =>{
      this.account = payload.find((acc: { newUserId: number; }) => this.userToGreet ? acc.newUserId == this.userToGreet.id : acc.newUserId == 99);
      console.log(this.account)
      this.accountId = this.account.id;
      console.log(this.accountId)
      console.log(this.newStock)
    })
    
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnncouncer.announce(`Sorted${sortState.direction}ending`);
    } else {
      this._liveAnncouncer.announce('Sorting cleared');
    }
  }
  
  //adding to cart makes a this.stocks if value[i].name already exists on this.stocks, just continue, else, add it in
  
  addToCart(id: number) {

    //check if this.stock.name exists on userStock db, if it does. alert "cannot add to cart as it is alread yin cart"
    //do a get request
    this.newStock.quantity = 1;
    this.newStock.accountId = this.accountId;
    this.newStock.sessionId = this.sessionId;
    console.log(this.newStock)


    for (let [key, value] of Object.entries(this.filteredStocks.find(stock => stock.id === id ))) {
      switch (key){
        case 'name':
          this.newStock.name = String(value);
          break;
          case 'symbol':
            this.newStock.symbol = String(value);
            break;
            case 'price':
              this.newStock.price = Number(value);
              break;
            }
          }
          console.log(this.newStock)
          this.filteredStocks.find(stock => stock.id === id).isUsed = true;
          this.stocksService.createUserStock(this.newStock).subscribe(data => {
            console.log(data)
          })
        }
        
}
