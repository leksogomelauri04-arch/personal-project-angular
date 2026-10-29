import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/user-services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  public auth = inject(AuthService);
  private host = inject(ElementRef<HTMLElement>);

  public menuOpen = signal(false);

  public toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  public closeMenu(): void {
    this.menuOpen.set(false);
  }

  public logout(): void {
    this.closeMenu();
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }
}