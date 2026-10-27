import { Component, inject, OnInit } from '@angular/core';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-car-details',
  styleUrl: './car-details.scss',
  templateUrl: './car-details.html',
})
export class CarDetails implements OnInit {
  public carServ = inject(CarsService)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('id')
    if(cardId){
      this.carServ.loadCarById(cardId)
    }
  }
}
