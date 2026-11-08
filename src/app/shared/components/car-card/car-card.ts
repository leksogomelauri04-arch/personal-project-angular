import { Component, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ICarListing } from '../../interfaces/cars.interface';
import { AuthService } from '../../../core/services/user-services/auth-service';
import { FavoritesService } from '../../../core/services/favorites-service/favorites-service';

@Component({
  selector: 'app-car-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './car-card.html',
  styleUrl: './car-card.scss',
})
export class CarCard {
  public car = input.required<ICarListing>();
  public showFavorite = input(true);

  public auth = inject(AuthService);
  public favServ = inject(FavoritesService);
}