import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';

  jwtHelper =  new JwtHelperService();

  decodedToken: any;

  currentUser: User;

  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {}

  changeMemberPhoto(photoUrl: string){
    this.photoUrl.next(photoUrl);

  }

  loginAction(model: any){
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const USER = response;
        if (USER) {
          localStorage.setItem('token', USER.token);
          localStorage.setItem('user', JSON.stringify(USER.user));
          this.decodedToken = this.jwtHelper.decodeToken(USER.token);
          this.currentUser = USER.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
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

  updateMainPhotoCurrentUser(photoUrl: string){
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }
}
