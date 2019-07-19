import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from "rxjs";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public allUsers;
  public showAddUser = false;
  public answer;

  ngOnInit() {
    this.answer = "";
    this.getAllUsers().subscribe(data => this.allUsers = data);
  }

  public addUser()
  {
    this.showAddUser = true;
  }

  public registrateUser(e)
  {
    console.log(e);
    //this.postUser(e.)
  }

  public getAllUsers() {
    return this.http.get('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/admin/allUsers/')
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteUser() {
    return this.http.get('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/admin/allUsers/')
      .pipe(
        catchError(this.handleError)
      );
  }

  public udateUsers() {
    return this.http.get('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/admin/allUsers/')
      .pipe(
        catchError(this.handleError)
      );
  }

  private postUser(name, email, password) {
    this.http.post("http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/admin/userInfo/",
      {
        'name': name,
        'email': email,
        'password': password
      })
      .subscribe(
        data => {
          console.log("POST Request is successful ", data);
          console.log(data);
          this.answer = data;
        },
        error => {
          console.log("Error", error);
        })
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}
