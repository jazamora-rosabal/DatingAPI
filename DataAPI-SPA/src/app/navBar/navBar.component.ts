import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent implements OnInit {

  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService,
              private notificationService: AlertifyService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }


  login(): void
  {
    this.authService.loginAction(this.model).subscribe(
      next => {
        this.notificationService.successDialog('Logged in Successfully');
      },
      error => {
        this.notificationService.errorDialog(error);
      },
      () => {
        this.router.navigate(['members']);
      }
    );
  }

  loggedIn(): boolean{
    return this.authService.loggedIn();
  }

  loggOut(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.notificationService.messageDialog('Logged out');
    this.router.navigate(['home']);
  }
}
