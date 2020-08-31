import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navBar.component.html'
})
export class NavBarComponent   {

  model: any = {};

  constructor(private authService: AuthService) { }


  login(): void
  {
    this.authService.loginAction(this.model).subscribe(
      next => {
        console.log('Logged in Successfully');
      },
      error => {
        console.log(error);
      }
    );
  }

  loggedIn(): boolean{
    const TOKEN = localStorage.getItem('token');
    return !!TOKEN;
  }

  loggOut(): void{
    localStorage.removeItem('token');
  }
}
