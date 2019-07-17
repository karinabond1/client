import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cars } from './cars.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cars$: Cars[];
  constructor(private httpclient: HttpClient) { }

  ngOnInit() {
    /*return this.getCars()
    .subscribe(
      data => this.cars$ = data
    );*/
  }

  //getCars(): Observable<any>{
    //return this.httpclient.get('http://192.168.0.15/~user14/REST/client/api/shop/cars');
  //}

}
