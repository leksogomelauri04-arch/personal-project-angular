import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { AuthService } from '../../core/services/user-services/auth-service';
import { FavoritesService } from '../../core/services/favorites-service/favorites-service';

@Component({
  imports: [RouterOutlet, RouterLink, FormsModule, DecimalPipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  public carServ = inject(CarsService);
  public favServ = inject(FavoritesService);
  public auth = inject(AuthService);
  private router = inject(Router);

  protected selectedBrand = '';
  protected selectedModel = '';
  protected selectedYear = '';
  protected availableModels: string[] = [];
  protected years = Array.from({ length: 2027 - 1960 + 1 }, (_, i) => 1960 + i);

  ngOnInit(): void {
    this.carServ.getCategories();
    this.carServ.loadLatestListings(10);
  }

  onBrandChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedBrand = target.value;
    this.selectedModel = '';
    const found = this.carServ.categories().find((cat) => cat.brand === this.selectedBrand);
    this.availableModels = found ? found.models : [];
  }

  onSearch(): void {
    this.router.navigate(['/search-results'], {
      queryParams: {
        brand: this.selectedBrand || null,
        model: this.selectedModel || null,
        year: this.selectedYear || null,
      },
    });
  }
}