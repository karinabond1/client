import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
//import { HttpClient } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'http://192.168.0.15/~user14/REST/client/api/shop/cars';

  constructor(private http: HttpClient){};

  getUsers(){
    return this.http.get<User[]>(this.apiUrl);
  }
}
