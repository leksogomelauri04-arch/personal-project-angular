import { inject, Injectable, Service, signal } from '@angular/core';
import { CarsApi } from '../cars-api';
import { validate } from '@angular/forms/signals';
import { ICategory } from '../../../shared/interfaces/cars.interface';
// @Injectable({
//   providedIn: 'root'
// })
@Service()
export class CarsService {
    private carsApi = inject(CarsApi)
    public categories = signal<ICategory[]>([])

    public getCategories(): void{
        this.carsApi.getCarsCategories().subscribe((value)=>{
            this.categories.set(value)
            console.log(value)
        })
    }
}
