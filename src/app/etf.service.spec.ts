import { TestBed } from '@angular/core/testing';

import { EtfService } from './etf.service';

describe('EtfService', () => {
  let service: EtfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
