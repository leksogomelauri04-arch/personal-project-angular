import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Spinner } from './shared/components/spinner/spinner';
import { SpinnerService } from './core/services/spinner-serv';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [RouterOutlet, Spinner, AsyncPipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('personal-angular-project');
  public spinnerServ = inject(SpinnerService)
}
