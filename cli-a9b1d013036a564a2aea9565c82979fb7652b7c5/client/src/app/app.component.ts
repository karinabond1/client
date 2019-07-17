import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(private http: HttpClient){}

    public name = localStorage.getItem('name');
    public role = localStorage.getItem('role');

    title = 'client';
    ngOnInit(){
        return true;
    }
}
