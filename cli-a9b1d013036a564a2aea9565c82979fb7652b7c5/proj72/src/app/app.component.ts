import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  users$: User[];

  constructor(private dataService: DataService, private http: HttpClient){}

  ngOnInit(){
    return this.dataService.getUsers()
    .subscribe(data => this.users$ = data);
  }  
}
