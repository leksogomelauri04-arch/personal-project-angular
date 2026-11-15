import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/user-services/auth-service';
import { FavoritesService } from '../../../core/services/favorites-service/favorites-service';


@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  public auth = inject(AuthService);
  public favServ = inject(FavoritesService);
  private host = inject(ElementRef<HTMLElement>);

  public menuOpen = signal(false);
  public navOpen = signal(false);

  public toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    this.navOpen.set(false);
  }

  public toggleNav(): void {
    this.navOpen.update((v) => !v);
    this.menuOpen.set(false);
  }

  public closeAll(): void {
    this.menuOpen.set(false);
    this.navOpen.set(false);
  }

  public logout(): void {
    this.closeAll();
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeAll();
    }
  }
}