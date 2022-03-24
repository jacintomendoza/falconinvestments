import { Component, OnInit } from '@angular/core';
import { MutualFundsService } from '../mutual-funds.service';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { MutualFund } from '../mutual-funds/mutual-fund.model';
import { Router } from '@angular/router';
import { Investment } from '../investment.model';
import { UserStoreService } from '../user-store.service';

@Component({
  selector: 'app-mutualfund',
  templateUrl: './mutualfund.component.html',
  styleUrls: ['./mutualfund.component.scss']
})
export class MutualfundComponent implements OnInit {
  custom: string = "white";
  isUsed: boolean = false;
  newInvestment: Investment = {
    name: '',
    type: 'Mutual Fund',
    symbol: '',
    expenseRatio: 0,
    nAV: 0,
    inceptionDate: '',
    accountId: 2,
  };
  accountId: number = 0

  mutualfund:MutualFund = {
    mf_id: 0
  }

  makeRed(){
    this.custom = "red";
  }

  makeOrange(){
    this.custom = "orange";
  }

  makeYellow(){
    this.custom = "yellow";
  }

  makeYellowGreen(){
    this.custom = "yellowgreen";
  }

  makeGreen(){
    this.custom = "green";
  }
  constructor(private route:ActivatedRoute,
              private mutualFundService: MutualFundsService,
              private accountService: AccountService,
              private userStoreService: UserStoreService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      const mf_id = +params['filteredFund.id'];
        // if(mf_id == NaN){
        //   this.route.navigateByUrl("/notfound")
        // }
      this.mutualFundService.getMutualFund(mf_id).subscribe(payload=>{
        this.mutualfund = payload;
        if(this.mutualfund.risk == 1) {
          this.makeGreen();
        } else if(this.mutualfund.risk == 2) {
          this.makeYellowGreen();
        } else if(this.mutualfund.risk == 3) {
          this.makeYellow();
        } else if(this.mutualfund.risk == 4) {
          this.makeOrange();
        } else {
          this.makeRed();
        }
      })
    })
    this.userStoreService.currentUser$.subscribe((response) => {
      if (response) {
        this.accountId = response.id;
      }
    });
    this.accountService.getInvestments().subscribe(payload =>
      {if (payload.find((x: { name: string | undefined; }) => x.name === this.mutualfund.fundName)) {
        this.isUsed = true;
      }}
      )
  }

  addFund(): void {
    this.newInvestment.name = this.mutualfund.fundName;
    this.newInvestment.symbol = this.mutualfund.symbol;
    this.newInvestment.inceptionDate = this.mutualfund.inceptionDate;
    this.newInvestment.expenseRatio = this.mutualfund.expenseRatio;
    this.newInvestment.nAV = this.mutualfund.nAV;
    this.newInvestment.accountId = this.accountId;
    this.isUsed = true;
    this.accountService.createInvestment(this.newInvestment).subscribe(payload => console.log(payload));
  }

}
