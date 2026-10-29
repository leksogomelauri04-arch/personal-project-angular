import { computed, effect, inject, Service, signal } from '@angular/core';
import { FavoritesApi } from './favorites-api';
import { AuthService } from '../user-services/auth-service';
import { IFavorite } from '../../../shared/interfaces/favorites.interface';

@Service()
export class FavoritesService {
  private api = inject(FavoritesApi);
  private auth = inject(AuthService);

  public favorites = signal<IFavorite[]>([]);
  public count = computed(() => this.favorites().length);
  private favoriteIds = computed(() => new Set(this.favorites().map((f) => String(f.carId))));

  // დალოგინება/გამოსვლისას ავტომატურად განახლდება
  private sync = effect(() => {
    const user = this.auth.currentUser();
    if (user?.id) {
      this.api.getByUser(user.id).subscribe({
        next: (list) => this.favorites.set(list),
        error: (err) => console.log('ფავორიტების ჩატვირთვა ვერ მოხერხდა:', err),
      });
    } else {
      this.favorites.set([]);
    }
  });

  public isFavorite(carId: string): boolean {
    return this.favoriteIds().has(String(carId));
  }

  public toggle(carId: string): void {
    const user = this.auth.currentUser();
    if (!user?.id) return;

    const existing = this.favorites().find((f) => String(f.carId) === String(carId));

    if (existing) {
      // ამოშლა
      const previous = this.favorites();
      this.favorites.set(previous.filter((f) => f !== existing));
      this.api.remove(existing.id!).subscribe({
        error: () => this.favorites.set(previous),
      });
    } else {
      // დამატება
      this.api.add({ userId: user.id, carId: String(carId) }).subscribe({
        next: (created) => this.favorites.update((list) => [...list, created]),
        error: (err) => console.error('ფავორიტში დამატება ვერ მოხერხდა:', err),
      });
    }
  }
}