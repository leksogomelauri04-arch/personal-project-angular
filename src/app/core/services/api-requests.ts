import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IUserInfo } from '../../shared/interfaces/users.interfaces';

const baseUrl = 'http://localhost:3000';

@Service()
export class ApiRequests {
    private http = inject(HttpClient);
    private users = signal<IUserInfo[]>([])


    public getUsers(): Observable<IUserInfo[]>{
       return this.http.get<IUserInfo[]>(`${baseUrl}/users`).pipe(
        tap((users: IUserInfo[]) => {
            this.users.set(users);
        })
       )
    }

    public login(){
        return this.getUsers()
    }
    public register(){
        
    }
}
