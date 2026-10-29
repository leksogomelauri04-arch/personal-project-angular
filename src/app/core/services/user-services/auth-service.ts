import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRequests } from './api-requests';
import { IUser, IUserInfo } from '../../../shared/interfaces/users.interfaces';
import { ErrorService } from '../error-service';
import { StorageKeys } from '../../enums/storage-keys.enum';
import { AppRoutes } from '../../enums/app-routes.enum';

export type ISessionUser = Omit<IUserInfo, 'password'>;

@Service()
export class AuthService {
  private apiService = inject(ApiRequests);
  private router = inject(Router);
  private errorServ = inject(ErrorService);

  private _currentUser = signal<ISessionUser | null>(this.loadUser());
  public currentUser = this._currentUser.asReadonly();
  public isLoggedIn = computed(() => this._currentUser() !== null);

  private loadUser(): ISessionUser | null {
    try {
      const raw = localStorage.getItem(StorageKeys.User);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public login(user: IUser, returnUrl: string = AppRoutes.Cars): void {
    this.apiService.login().subscribe((usersInfo: IUserInfo[]) => {
      const found = usersInfo.find(
        (u) => u.email === user.email && u.password === user.password
      );

      if (!found) {
        this.errorServ.setErrorMsg('არასწორი ელ-ფოსტა ან პაროლი');
        this.errorServ.clearMsg();
        return;
      }

      const { password, ...safeUser } = found;
      this._currentUser.set(safeUser);
      localStorage.setItem(StorageKeys.User, JSON.stringify(safeUser));
      this.router.navigateByUrl(returnUrl);
    });
  }

  public logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(StorageKeys.User);
    this.router.navigateByUrl(AppRoutes.Cars);
  }

  public register(userInfo: IUserInfo): void {
  this.apiService.register(userInfo).subscribe({
    next: (created) => {
      if (created) this.router.navigateByUrl(AppRoutes.Login);
    },
    error: (err) => console.error('Register error:', err),
  });
}
}