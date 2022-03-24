import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConfirmationDialogComponent } from './purchase-confirmation-dialog.component';

describe('PurchaseConfirmationDialogComponent', () => {
  let component: PurchaseConfirmationDialogComponent;
  let fixture: ComponentFixture<PurchaseConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
