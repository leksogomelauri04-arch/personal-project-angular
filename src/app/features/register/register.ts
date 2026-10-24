import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';

@Component({
  imports: [],
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
    password: new FormControl(''),
    confrimPassword: new FormControl(''),
    confrim: new FormControl('')
  })
}
