import { inject, Injectable, Service, signal } from '@angular/core';
import { validate } from '@angular/forms/signals';
import { ICarListing, ICategory } from '../../../shared/interfaces/cars.interface';
import { CarsApi } from './cars-api';
// @Injectable({
//   providedIn: 'root'
// })
@Service()
export class CarsService {
    private carsApi = inject(CarsApi)
    public categories = signal<ICategory[]>([])
    public listings = signal<ICarListing[]>([])

    public getCategories(): void{
        this.carsApi.getCarsCategories().subscribe((value)=>{
            this.categories.set(value)
            console.log(value)
        })
    }
    public loadListings(filters?: {brand?:string, model?:string, year?:string}):void{
        this.carsApi.getListings(filters).subscribe({
            next: (value) => this.listings.set(value),
            error: (err) => console.log('ჩატვირთვა ვერ მოხერხდა:', err)

        })
    }
    public selectedCar = signal<ICarListing | null>(null)
    public loadCarById(id: string):void{
        this.carsApi.getListingById(id).subscribe({
            next:(car) => this.selectedCar.set(car),
            error:(err) => console.log('მანქანის დეტალების ჩატვირთვა ვერ მოხერხდა: ',err)
            
        })
    }
}
