import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'cars',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./features/car-search-results/car-search-results').then((m) => m.CarSearchResults),
  },
  {
    path: 'car/:id',
    loadComponent: () => import('./features/car-details/car-details').then((m) => m.CarDetails),
  },
  {
    path: 'add-car',
    canActivate: [authGuard],
    loadComponent: () => import('./features/add-car/add-car').then((m) => m.AddCar),
  },
  {
    path: 'edit-car/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/add-car/add-car').then((m) => m.AddCar),
  },
  {
    path: 'my-listings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/my-listings/my-listings').then((m) => m.MyListings),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites),
  },
  { path: '**', redirectTo: 'cars' },
];