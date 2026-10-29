import { Component, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { FavoritesService } from '../../core/services/favorites-service/favorites-service';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public carServ = inject(CarsService);
  public favServ = inject(FavoritesService);

  public favoriteCars = computed(() => {
    const ids = new Set(this.favServ.favorites().map((f) => String(f.carId)));
    return this.carServ.listings().filter((car) => ids.has(String(car.id)));
  });

  ngOnInit(): void {
    this.carServ.loadListings();
  }
}