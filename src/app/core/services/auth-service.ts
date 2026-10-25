import { inject, Service } from '@angular/core';
import { ApiRequests } from './api-requests';
import { IUser, IUserInfo } from '../../shared/interfaces/users.interfaces';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private apiService = inject(ApiRequests)
    private router = inject(Router)
    public login(user : IUser){
        this.apiService.login().pipe(
            tap((usersInfo: IUserInfo[]) => {
              const findedUser = usersInfo.find(
                (userInfo) => userInfo.email === user.email && userInfo.password === user.password)

                if(findedUser) {
                    this.router.navigate()
                }
                console.log(findedUser)
            })
        ).subscribe()
    }
    public register(){
        
    }
}
