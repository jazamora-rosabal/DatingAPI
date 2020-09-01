import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  constructor(private authServices: AuthService, private notificationService: AlertifyService) {}

  ngOnInit(): void {}

  register(): void {
    this.authServices.registerAction(this.model).subscribe(
      () => {
        this.notificationService.successDialog( 'Register Successful' );
      },
      error => {
        this.notificationService.errorDialog(error);
      }
    );
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
