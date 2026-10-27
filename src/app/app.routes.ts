import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CarSearchResults } from './features/car-search-results/car-search-results';
import { CarDetails } from './features/car-details/car-details';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'cars',
        component: Dashboard // მთავარი დეშბორდი სელექთებით
    },
    {
        path: 'search-results',
        component: CarSearchResults // სერჩის შედეგების ცალკე, დამოუკიდებელი გვერდი
    },
    {
        path: 'car/:id',
        component: CarDetails // მანქანის დეტალური გვერდი
    }
];