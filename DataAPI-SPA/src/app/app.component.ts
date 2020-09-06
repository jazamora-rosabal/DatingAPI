import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DataAPI-SPA';
  jwtHelper =  new JwtHelperService();

  constructor(private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
    const TOKEN = localStorage.getItem('token');
    const USER: User = JSON.parse(localStorage.getItem('user'));
    if (TOKEN) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(TOKEN);
      if (USER) {
        this.authService.currentUser = USER;
        this.authService.changeMemberPhoto(USER.photoUrl);
      }else{
        this.userService.getUser(this.authService.decodedToken.nameid).subscribe((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.authService.currentUser = user;
          this.authService.changeMemberPhoto(user.photoUrl);
        });
      }
    }
  }
}
