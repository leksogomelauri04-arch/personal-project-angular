import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ICarListing, ICategory } from '../../../shared/interfaces/cars.interface';
import { CarsApi } from './cars-api';
import { ApiRequests } from '../user-services/api-requests';

@Service()
export class CarsService {
  private carsApi = inject(CarsApi);
  private usersApi = inject(ApiRequests);

  public categories = signal<ICategory[]>([]);
  public listings = signal<ICarListing[]>([]);
  public latestListings = signal<ICarListing[]>([]);
  public myListings = signal<ICarListing[]>([]);
  public selectedCar = signal<ICarListing | null>(null);
  public seller = signal<{ username: string; mobile: string } | null>(null);

  public getCategories(): void {
    this.carsApi.getCarsCategories().subscribe((value) => this.categories.set(value));
  }

  public loadListings(filters?: { brand?: string; model?: string; year?: string }): void {
    this.carsApi.getListings(filters).subscribe({
      next: (value) => this.listings.set(value),
      error: (err) => console.log('ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  public loadLatestListings(limit: number = 10): void {
    this.carsApi.getLatestListings(limit).subscribe({
      next: (value) => this.latestListings.set(value),
      error: (err) => console.log('ბოლო განცხადებების ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  public loadMyListings(userId: string): void {
    this.myListings.set([]);
    this.carsApi.getListings({ userId }).subscribe({
      next: (value) => this.myListings.set(value),
      error: (err) => console.log('ჩემი განცხადებების ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  public loadCarById(id: string): void {
    this.seller.set(null);
    this.selectedCar.set(null);

    this.carsApi.getListingById(id).subscribe({
      next: (car) => {
        this.selectedCar.set(car);
        this.loadSeller(car.userId);
      },
      error: (err) => console.log('მანქანის დეტალების ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  private loadSeller(userId: string): void {
    if (!userId) return;

    this.usersApi.getUserById(userId).subscribe({
      next: (user) => this.seller.set({ username: user.username, mobile: user.mobile }),
      error: (err) => console.log('გამყიდველის ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  public createListing(car: Partial<ICarListing>): Observable<ICarListing> {
    return this.carsApi.createListing(car);
  }
}