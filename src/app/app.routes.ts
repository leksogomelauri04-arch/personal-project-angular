import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CarSearchResults } from './features/car-search-results/car-search-results';
import { CarDetails } from './features/car-details/car-details';
import { AddCar } from './features/add-car/add-car';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'cars', component: Dashboard },
  { path: 'search-results', component: CarSearchResults },
  { path: 'car/:id', component: CarDetails },
  { path: 'add-car', component: AddCar, canActivate: [authGuard] },
  { path: '**', redirectTo: 'cars' },
];