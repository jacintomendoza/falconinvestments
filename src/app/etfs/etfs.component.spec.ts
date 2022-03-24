import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtfsComponent } from './etfs.component';

describe('EtfsComponent', () => {
  let component: EtfsComponent;
  let fixture: ComponentFixture<EtfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtfsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
