import { formatPercent } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Certificate } from '../certificate.model';
import { CertificateService } from '../certificate.service';
import { PurchaseConfirmationDialogComponent } from '../purchase-confirmation-dialog/purchase-confirmation-dialog.component';
import { SellConfirmationDialogComponent } from '../sell-confirmation-dialog/sell-confirmation-dialog.component';
import { UserStoreService } from '../user-store.service';

const { DateTime } = require('luxon');

/* Possible issue with calculating & displaying with local timezone? */

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss'],
})
export class CertificatesComponent implements OnInit, OnDestroy {
  isSignedIn: boolean = false;
  isLoadingCertificates: boolean = false;
  today = new FormControl(new Date());
  certificateName: string | null = null;
  initialAmount: number = 1000;
  lengthOfCd: number = 1;
  APY: number = 0.001;
  rateToDisplay: string = '0.10%';
  userCertificates: Certificate[] = [];

  constructor(
    private userStore: UserStoreService,
    private certificateService: CertificateService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  private getCertificatesSubscription: any;

  ngOnInit(): void {
    this.getCertificatesSubscription =
      this.certificateService.userCertificates$.subscribe((certificates) => {
        this.isLoadingCertificates = true;
        if (certificates.length === 0) {
          this.isLoadingCertificates = false;
          this.getCertificatesSubscription.unsubscribe();
        } else if (certificates.length > 0) {
          this.userCertificates = certificates;
          this.getCertificatesSubscription.unsubscribe();
          this.isLoadingCertificates = false;
        }
      });
    if (this.userStore.currentUser && this.userStore.currentUser.id) {
      this.isSignedIn = true;
      let userId = this.userStore.currentUser.id;
      this.certificateService.fetchUserCertificates(userId);
    } else {
      this.isLoadingCertificates = false;
      this.isSignedIn = false;
    }
  }

  ngOnDestroy(): void {
    this.getCertificatesSubscription.unsubscribe();
  }

  sellCD(id: number): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const sellDialogRef = this.dialog.open(SellConfirmationDialogComponent);
    sellDialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        const sellCertificateSubscription = this.certificateService
          .removeCertificate(id)
          .subscribe((response) => {
            if (response.status === 'success') {
              sellCertificateSubscription.unsubscribe();
              if (this.userStore.currentUser) {
                this.certificateService.fetchUserCertificates(
                  this.userStore.currentUser.id
                );
                this.isLoadingCertificates = true;
                setTimeout(() => {
                  this.isLoadingCertificates = false;
                  this.router.navigate(['/certificates']);
                }, 1000);
              }
            }
          });
      }
    });
  }

  buyCD(): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    if (this.certificateName === '') {
      this.certificateName = null;
    }

    const maturityDate = DateTime.local(
      this.today.value.getFullYear(),
      this.today.value.getMonth() + 1,
      this.today.value.getDate()
    ).plus({ months: this.lengthOfCd });

    const purchaseDialogRef = this.dialog.open(
      PurchaseConfirmationDialogComponent
    );
    purchaseDialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.userStore.currentUser && this.userStore.currentUser.id) {
          const newCertObj: {
            name: string | null;
            initialAmount: number;
            interestRate: number;
            startDate: Date;
            maturityDate: Date;
            userId: number;
          } = {
            name: this.certificateName,
            initialAmount: this.initialAmount,
            interestRate: this.APY,
            startDate: this.today.value,
            maturityDate: maturityDate,
            userId: this.userStore.currentUser.id,
          };

          const newCertificateSubscription = this.certificateService
            .addCertificate(newCertObj)
            .subscribe((response) => {
              newCertificateSubscription.unsubscribe();
              this.router.navigate(['/certificates']);
            });
        } else {
          alert('You must be signed in to make this purchase.');
        }
      }
    });
  }

  numMonths(start: Date, end: Date) {
    const startDate = DateTime.fromISO(start);
    const endDate = DateTime.fromISO(end);

    return endDate.diff(startDate, ['months']).toObject().months;
  }

  calcTimeRemaining(end: Date) {
    const startDate = DateTime.fromJSDate(new Date());
    const endDate = DateTime.fromISO(end);

    return endDate
      .diff(startDate, ['years', 'months', 'days'])
      .toHuman({ floor: true });
  }

  updateInterest(): void {
    if (this.lengthOfCd >= 1 && this.lengthOfCd < 4) {
      this.APY = 0.001;
    } else if (this.lengthOfCd >= 4 && this.lengthOfCd < 7) {
      this.APY = 0.0025;
    } else if (this.lengthOfCd >= 7 && this.lengthOfCd < 10) {
      this.APY = 0.004;
    } else if (this.lengthOfCd >= 10 && this.lengthOfCd < 13) {
      this.APY = 0.005;
    } else if (this.lengthOfCd >= 13 && this.lengthOfCd < 24) {
      this.APY = 0.0075;
    } else if (this.lengthOfCd >= 24 && this.lengthOfCd < 36) {
      this.APY = 0.011;
    } else if (this.lengthOfCd >= 36 && this.lengthOfCd < 48) {
      this.APY = 0.014;
    } else if (this.lengthOfCd >= 48 && this.lengthOfCd < 60) {
      this.APY = 0.016;
    } else if (this.lengthOfCd >= 60 && this.lengthOfCd < 120) {
      this.APY = 0.017;
    } else if (this.lengthOfCd >= 120) {
      this.APY = 0.021;
    } /* else {
      // This would be an error
    }
    */
    this.rateToDisplay = formatPercent(this.APY, 'en-US', '1.2-3');
  }
}
