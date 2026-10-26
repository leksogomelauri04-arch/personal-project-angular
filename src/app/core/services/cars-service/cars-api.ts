import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { baseUrl } from '../user-services/api-requests';
import { delay, Observable, tap } from 'rxjs';
import { ErrorService } from '../error-service';
import { SpinnerService } from '../spinner-serv';
import { ICategory } from '../../../shared/interfaces/cars.interface';
// @Injectable({
//   providedIn: 'root'
// })
@Service()
export class CarsApi {
    private http = inject(HttpClient)
    private errorServ = inject(ErrorService)
    private spinnerServ = inject(SpinnerService)

    public getCarsCategories(): Observable<ICategory[]>{
        this.spinnerServ.$spinnerOn.next(true)

        return this.http.get<ICategory[]>(`${baseUrl}/categories`).pipe(
            delay(2000),
            tap(()=>{
                this.spinnerServ.$spinnerOn.next(false)
            },
        ()=>{
            this.errorServ.setErrorMsg('there is no any categoriy')
            this.errorServ.clearMsg()
            this.spinnerServ.$spinnerOn.next(false)
        })
        )
    }
}
