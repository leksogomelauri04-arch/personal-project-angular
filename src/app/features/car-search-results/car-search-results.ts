import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { CarCard } from '../../shared/components/car-card/car-card';

@Component({
  imports: [CarCard],
  selector: 'app-car-search-results',
  styleUrl: './car-search-results.scss',
  templateUrl: './car-search-results.html',
})
export class CarSearchResults implements OnInit {
  public carServ = inject(CarsService);
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