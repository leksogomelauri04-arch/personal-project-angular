import { Component, inject, OnInit } from '@angular/core';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-car-search-results',
  styleUrl: './car-search-results.scss',
  templateUrl: './car-search-results.html',
})
export class CarSearchResults implements OnInit {
  public carServ = inject(CarsService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      const brand = params['brand']
      const model = params['model']
      const year = params['year']

      this.carServ.loadListings({brand, model, year})
    }) 
  }
  goToCarDetails(carId: string):void{
    this.router.navigate(['/car', carId])
  }

}
