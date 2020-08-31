import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login(): void
  {
    this.authService.loginAction(this.model).subscribe(
      next =>{
        console.log('Logged in Successfully');
      },
      error => {
        console.log('Faild to loggin');
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
