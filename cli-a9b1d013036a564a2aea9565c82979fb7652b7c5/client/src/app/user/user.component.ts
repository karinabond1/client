import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from './user.module';
import { catchError } from 'rxjs/operators'; 
import { throwError } from "rxjs";


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: []
})
export class UserComponent implements OnInit{

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'my-auth-token',
        })
    };

    public users = new User();
    public user;
    public receivedUser: User;
    public done: boolean = false;
    public name = localStorage.getItem('name');
    public error = '';

    constructor( private http: HttpClient){}

    
    onSubmitLogOut(){
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('status');
        localStorage.removeItem('role');
        this.name = '';
        window.location.reload();
    }

    onSubmitLog(e) {
        this.http.put(/*"http://192.168.0.15/~user14*/"http://gfl:8070/BOARDROOM_BOOKER/server/api/user/user/",
            {
        "email":  e.value.email,
        "password":  e.value.password
        })
        .subscribe(
            data  => {
                if(Array.isArray(data) && data[0]['status']==1){
                    this.user = data;
                    localStorage.setItem('id', data[0]['id']);
                    localStorage.setItem('name', data[0]['name']);
                    localStorage.setItem('status', data[0]['status']);
                    localStorage.setItem('role', data[0]['role']);
                    this.name = localStorage.getItem('name');
                    window.location.reload();
                }else{
                    e.value.email='';
                    e.value.password='';
                    this.error = "Email and/or password is incorrect!";
                }
                
            },
            error  => {
            }

        );
    }
    

    ngOnInit(){
        
    }
  

}

