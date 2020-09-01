import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navBar.component.html',
  styles: [ '.dropdown-toggle, .dropdown-item{cursor:pointer; text-decoration: none;}' ]
})
export class NavBarComponent   {

  model: any = {};

  constructor(public authService: AuthService, private notificationService: AlertifyService) { }


  login(): void
  {
    this.authService.loginAction(this.model).subscribe(
      next => {
        this.notificationService.successDialog('Logged in Successfully');
      },
      error => {
        this.notificationService.errorDialog(error);
      }
    );
  }

  loggedIn(): boolean{
    return this.authService.loggedIn();
  }

  loggOut(): void{
    localStorage.removeItem('token');
    this.notificationService.messageDialog('Logged out');
  }
}
