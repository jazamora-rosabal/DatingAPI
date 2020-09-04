import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IValue } from '../_models/value';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: IValue[];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    /* this.getValues(); */
  }

  /* getValues() {
    this.http.get('http://localhost:5000/api/values').subscribe(
      (data: IValue[]) => {
        this.values = data;
      },
      (error) => {
        console.log(error);
      }
    );
  } */

  cancelRegisterHome(registerMode: boolean): void{
    this.registerMode =  registerMode;
  }
}
