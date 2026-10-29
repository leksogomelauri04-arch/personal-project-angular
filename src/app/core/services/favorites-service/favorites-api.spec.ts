import { TestBed } from '@angular/core/testing';
import { FavoritesApi } from './favorites-api';

describe('FavoritesApi', () => {
  let service: FavoritesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
