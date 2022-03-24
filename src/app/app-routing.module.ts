import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { StocksComponent } from './stocks/stocks.component';
import { MutualFundsComponent } from './mutual-funds/mutual-funds.component';
import { MutualfundComponent } from './mutualfund/mutualfund.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { EtfsComponent } from './etfs/etfs.component';
import { CartComponent } from './cart/cart.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { RetirementCalculatorComponent } from './retirement-calculator/retirement-calculator.component';

const routes: Routes = [
  {path: "", redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'certificates', component: CertificatesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'stocks', component: StocksComponent },
  { path: 'mutualfunds', component: MutualFundsComponent },
  { path: 'mutualfunds/:filteredFund.id', component: MutualfundComponent},
  { path: 'etfs', component: EtfsComponent},
  { path: "cart", component: CartComponent},
  { path: 'advisor', component: AdvisorComponent},
  { path: 'retirement', component: RetirementCalculatorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
