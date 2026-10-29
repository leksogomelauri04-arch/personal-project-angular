import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, of, switchMap, tap, delay } from 'rxjs';
import { IUserInfo } from '../../../shared/interfaces/users.interfaces';
import { ErrorService } from '../error-service';
import { SpinnerService } from '../spinner-serv';

export const baseUrl = 'http://localhost:3000';

@Service()
export class ApiRequests {
  private http = inject(HttpClient);
  private users = signal<IUserInfo[]>([]);
  private errorServ = inject(ErrorService);
  private spinnerServ = inject(SpinnerService);

  public getUsers(): Observable<IUserInfo[]> {
    this.spinnerServ.$spinnerOn.next(true);
    return this.http.get<IUserInfo[]>(`${baseUrl}/users`).pipe(
      delay(1000),
      tap({
        next: (users) => {
          this.users.set(users);
          this.spinnerServ.$spinnerOn.next(false);
        },
        error: () => {
          this.errorServ.setErrorMsg('http request Error');
          this.errorServ.clearMsg();
          this.spinnerServ.$spinnerOn.next(false);
        },
      })
    );
  }

  public login(): Observable<IUserInfo[]> {
    return this.getUsers();
  }

  // null ნიშნავს, რომ მომხმარებელი უკვე არსებობს
  public register(userInfo: IUserInfo): Observable<IUserInfo | null> {
    return this.getUsers().pipe(
      switchMap((usersInfo) => {
        const exists = usersInfo.some(
          (u) => u.email === userInfo.email || u.mobile === userInfo.mobile
        );

        if (exists) {
          this.errorServ.setErrorMsg('ეს ელ-ფოსტა ან ტელეფონის ნომერი უკვე დარეგისტრირებულია');
          this.errorServ.clearMsg();
          return of(null);
        }

        return this.registerUser(userInfo);
      })
    );
  }

  public registerUser(userInfo: IUserInfo): Observable<IUserInfo> {
    this.spinnerServ.$spinnerOn.next(true);
    return this.http.post<IUserInfo>(`${baseUrl}/users`, userInfo).pipe(
      tap({
        next: () => this.spinnerServ.$spinnerOn.next(false),
        error: () => {
          this.errorServ.setErrorMsg('რეგისტრაცია ვერ მოხერხდა');
          this.errorServ.clearMsg();
          this.spinnerServ.$spinnerOn.next(false);
        },
      })
    );
  }
}