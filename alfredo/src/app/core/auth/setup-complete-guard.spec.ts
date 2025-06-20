import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { setupCompleteGuard } from './setup-complete-guard';

describe('setupCompleteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => setupCompleteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
