import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IValue } from '../IValue'; 
import { from } from 'rxjs';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html'
})
export class ValueComponent implements OnInit {

  values: IValue[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  getValues()
  {
    this.http.get('http://localhost:5000/api/values').subscribe((data: IValue[]) =>
    {
      this.values = data;
    }, error =>
    {
      console.log(error);
    });
  }

}
