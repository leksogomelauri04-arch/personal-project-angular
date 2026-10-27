import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarSearchResults } from './car-search-results';

describe('CarSearchResults', () => {
  let component: CarSearchResults;
  let fixture: ComponentFixture<CarSearchResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarSearchResults],
    }).compileComponents();

    fixture = TestBed.createComponent(CarSearchResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
