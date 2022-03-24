import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StocksComponent } from './stocks/stocks.component';
import { SignoutButtonComponent } from './signout-button/signout-button.component';
import { MutualFundsComponent } from './mutual-funds/mutual-funds.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { EtfsComponent } from './etfs/etfs.component';
import { CartComponent } from './cart/cart.component';
import { NewsComponent } from './news/news.component';
import { MutualfundComponent } from './mutualfund/mutualfund.component';
import { PurchaseConfirmationDialogComponent } from './purchase-confirmation-dialog/purchase-confirmation-dialog.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { RetirementCalculatorComponent } from './retirement-calculator/retirement-calculator.component';
import { SellConfirmationDialogComponent } from './sell-confirmation-dialog/sell-confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent, 
  SignupComponent, 
  SigninComponent, 
  HomeComponent, 
  DashboardComponent, 
  StocksComponent, 
  SignoutButtonComponent, 
  MutualFundsComponent, 
  CertificatesComponent, 
  EtfsComponent, 
  NewsComponent,
  CartComponent,
  PurchaseConfirmationDialogComponent,
  MutualfundComponent,
  AdvisorComponent,
  RetirementCalculatorComponent,
  SellConfirmationDialogComponent
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    LayoutModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}