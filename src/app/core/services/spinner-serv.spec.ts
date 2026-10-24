import { TestBed } from '@angular/core/testing';
import { SpinnerServ } from './spinner-serv';

describe('SpinnerServ', () => {
  let service: SpinnerServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
