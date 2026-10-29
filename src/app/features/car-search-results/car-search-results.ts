import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { AuthService } from '../../core/services/user-services/auth-service';
import { FavoritesService } from '../../core/services/favorites-service/favorites-service';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-car-search-results',
  styleUrl: './car-search-results.scss',
  templateUrl: './car-search-results.html',
})
export class CarSearchResults implements OnInit {
  public carServ = inject(CarsService);
  public favServ = inject(FavoritesService);
  public auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.carServ.loadListings({
        brand: params['brand'],
        model: params['model'],
        year: params['year'],
      });
    });
  }
}