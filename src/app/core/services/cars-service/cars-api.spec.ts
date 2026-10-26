import { TestBed } from '@angular/core/testing';
import { CarsApi } from './cars-api';

describe('CarsApi', () => {
  let service: CarsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
