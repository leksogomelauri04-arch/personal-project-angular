import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { baseUrl } from '../user-services/api-requests';
import { ErrorService } from '../error-service';
import { SpinnerService } from '../spinner-serv';
import { ICarListing, ICategory } from '../../../shared/interfaces/cars.interface';

@Service()
export class CarsApi {
  private http = inject(HttpClient);
  private errorServ = inject(ErrorService);
  private spinnerServ = inject(SpinnerService);

  public getCarsCategories(): Observable<ICategory[]> {
    this.spinnerServ.$spinnerOn.next(true);

    return this.http.get<ICategory[]>(`${baseUrl}/categories`).pipe(
      delay(2000),
      tap({
        next: () => this.spinnerServ.$spinnerOn.next(false),
        error: () => {
          this.errorServ.setErrorMsg('ვერ მოიძებნა');
          this.errorServ.clearMsg();
          this.spinnerServ.$spinnerOn.next(false);
        },
      })
    );
  }

  public getListings(filters?: { brand?: string; model?: string; year?: any }): Observable<ICarListing[]> {
    let params = new HttpParams();

    if (filters?.brand) {
      params = params.set('brand', filters.brand);
    }
    if (filters?.model) {
      params = params.set('model', filters.model);
    }
    // აქ ვამოწმებთ: თუ წელი არსებობს, გადავცემთ როგორც რიცხვს (Number)
    if (filters?.year) {
      params = params.set('year', Number(filters.year)); 
    }

    return this.http.get<ICarListing[]>(`${baseUrl}/listings`, { params });
  }

  public getListingById(id: string): Observable<ICarListing> {
    return this.http.get<ICarListing>(`${baseUrl}/listings/${id}`);
  }
  public createListing(car: Partial<ICarListing>): Observable<ICarListing> {
    return this.http.post<ICarListing>(`${baseUrl}/listings`, car);
  }
}