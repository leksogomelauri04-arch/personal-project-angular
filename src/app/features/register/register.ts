import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { matchValidator } from './validators';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  public userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.minLength(10), Validators.email]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?:\+?995\s?)?5\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/) 
    ]),
    passwordGroup: new FormGroup({
      password: new FormControl('',
         [Validators.required,
          Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$')]),
      confirmPassword: new FormControl('', Validators.required),
    },
    [matchValidator('password', 'confirmPassword')],
  ),
    
    confirm: new FormControl('', [Validators.requiredTrue])
  })
}
