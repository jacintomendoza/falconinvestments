import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementCalculatorComponent } from './retirement-calculator.component';

describe('RetirementCalculatorComponent', () => {
  let component: RetirementCalculatorComponent;
  let fixture: ComponentFixture<RetirementCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetirementCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
