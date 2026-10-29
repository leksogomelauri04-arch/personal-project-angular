import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../user-services/api-requests';
import { IFavorite } from '../../../shared/interfaces/favorites.interface';

@Service()
export class FavoritesApi {
  private http = inject(HttpClient);

  public getByUser(userId: string): Observable<IFavorite[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<IFavorite[]>(`${baseUrl}/favorites`, { params });
  }

  public add(fav: IFavorite): Observable<IFavorite> {
    return this.http.post<IFavorite>(`${baseUrl}/favorites`, fav);
  }

  public remove(id: string): Observable<unknown> {
    return this.http.delete(`${baseUrl}/favorites/${id}`);
  }
}