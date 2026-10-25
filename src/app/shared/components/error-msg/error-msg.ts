import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-error-msg',
  styles:`
  p{
    color: red;
    margin-top: 5px;
  }
  `,
  template:`<p>{{errorMsg()}}</p>`
})
export class ErrorMsg {
  public errorMsg = input<string>('')
}
