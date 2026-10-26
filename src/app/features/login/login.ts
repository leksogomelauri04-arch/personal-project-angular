import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ErrorMsg } from '../../shared/components/error-msg/error-msg';
import { AuthService } from '../../core/services/user-services/auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink, ErrorMsg],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService)

  public userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(10)]),
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$'),
    ]),
  })

  public login() {
    const user = {
      email: this.emailControl.value,
      password: this.passwordControl.value
    };
    this.authService.login(user)
  }

  public get emailControl():FormControl{
    return this.userForm.get('email') as FormControl
  }
  public get passwordControl():FormControl{
    return this.userForm.get('password') as FormControl
  }
}
