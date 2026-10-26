import { Component, inject } from '@angular/core';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private carServ = inject(CarsService);
  constructor(){
    this.carServ.getCategories()
  }

  protected years = Array.from({ length: 2027 - 1960 + 1 }, (_, i) => 1960 + i);
}
