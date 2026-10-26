import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { baseUrl } from './user-services/api-requests';
import { Observable } from 'rxjs';
import { ICategory } from '../../shared/interfaces/cars.interface';

@Service()
export class CarsApi {
    private http = inject(HttpClient)

    public getCarsCategories(): Observable<ICategory[]>{
        return this.http.get<ICategory[]>(`${baseUrl}/categories`);
    }
}
