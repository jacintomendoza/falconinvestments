import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellConfirmationDialogComponent } from './sell-confirmation-dialog.component';

describe('SellConfirmationDialogComponent', () => {
  let component: SellConfirmationDialogComponent;
  let fixture: ComponentFixture<SellConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
