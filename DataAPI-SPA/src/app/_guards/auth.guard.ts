import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Guard encargado de comprobar si el usuerio esta autenticado para darle acceso a las rutas
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private notificationService: AlertifyService,
              private router: Router){}

  canActivate(): boolean  {
    if ( this.authService.loggedIn() ){
      return true;
    }
    this.notificationService.warningDialog('No tienes acceso a la URL');
    this.router.navigate(['home']);
  }
}
