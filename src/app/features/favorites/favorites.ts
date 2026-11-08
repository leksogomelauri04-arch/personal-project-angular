import { Component, computed, inject, OnInit } from '@angular/core';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { FavoritesService } from '../../core/services/favorites-service/favorites-service';
import { CarCard } from '../../shared/components/car-card/car-card';

@Component({
  selector: 'app-favorites',
  imports: [CarCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public carServ = inject(CarsService);
  private favServ = inject(FavoritesService);

  public favoriteCars = computed(() => {
    const ids = new Set(this.favServ.favorites().map((f) => String(f.carId)));
    return this.carServ.listings().filter((car) => ids.has(String(car.id)));
  });

  ngOnInit(): void {
    this.carServ.loadListings();
  }
}