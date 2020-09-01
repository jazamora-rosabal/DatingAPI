import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';

  jwtHelper =  new JwtHelperService();

  decodedToken: any;

  constructor(private http: HttpClient) {}


  loginAction(model: any){
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const USER = response;
        if (USER) {
          localStorage.setItem('token', USER.token);
          this.decodedToken = this.jwtHelper.decodeToken(USER.token);
        }
      })
    );
  }

  registerAction(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }


  loggedIn(): boolean{
    const TOKEN = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(TOKEN);
  }
}
