import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { AuthService } from '../../core/services/user-services/auth-service';

@Component({
  selector: 'app-my-listings',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.scss',
})
export class MyListings implements OnInit {
  public carServ = inject(CarsService);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user?.id) {
      this.carServ.loadMyListings(user.id);
    }
  }
}