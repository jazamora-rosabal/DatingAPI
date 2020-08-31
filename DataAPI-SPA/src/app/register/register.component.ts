import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  constructor(private authServices: AuthService) {}

  ngOnInit(): void {}

  register(): void {
    this.authServices.registerAction(this.model).subscribe(
      () => {
        console.log( 'Register Successful' );
      },
      error => {
        console.log(error);
      }
    );
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
