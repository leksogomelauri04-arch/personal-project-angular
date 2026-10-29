import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorMsg } from '../../shared/components/error-msg/error-msg';
import { AuthService } from '../../core/services/user-services/auth-service';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  imports: [ReactiveFormsModule, RouterLink, ErrorMsg],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  public userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required]),
  });

  public login() {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ?? AppRoutes.Cars;

    this.authService.login(
      {
        email: this.emailControl.value,
        password: this.passwordControl.value,
      },
      returnUrl
    );
  }

  public get emailControl(): FormControl {
    return this.userForm.get('email') as FormControl;
  }
  public get passwordControl(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
}