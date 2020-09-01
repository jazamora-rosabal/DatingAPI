import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DataAPI-SPA';
  jwtHelper =  new JwtHelperService();

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const TOKEN = localStorage.getItem('token');
    if (TOKEN) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(TOKEN);
    }
  }
}
