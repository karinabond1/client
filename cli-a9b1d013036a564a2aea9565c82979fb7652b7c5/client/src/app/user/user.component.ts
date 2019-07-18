import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from './user.module';
import { catchError } from 'rxjs/operators'; 
import { throwError } from "rxjs";


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    /*template: `<div class="form-group">
                    <label>Email</label>
                    <input class="form-control" name="email" [(ngModel)]="user.email" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input class="form-control" type="password" name="password" [(ngModel)]="user.password" />
                </div>
                <div class="form-group">
                    <button class="btn btn-default" (click)="submit(user)">Sendd</button>
                </div>
                <div *ngIf="done">
                    <div>Получено от сервера:</div>
                    <div>Имя: {{receivedUser.email}}</div>
                    <div>Возраст: {{receivedUser.password}}</div>
                </div>`,*/
    providers: []
})
export class UserComponent implements OnInit{

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'my-auth-token',
          //'Content-Type': 'Access-Control-Allow-Headers',
          //'POST,GET,OPTIONS,PUT,DELETE': 'Access-Control-Allow-Methods'

        })
    };

    public users = new User();
    public user;
    public receivedUser: User;
    public done: boolean = false;
    //public dataService: DataService;
    public name = localStorage.getItem('name');
    public error = '';

    constructor( private http: HttpClient){}

    
    onSubmitLogOut(){
        console.log('f');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('status');
        localStorage.removeItem('role');
        this.name = '';
        window.location.reload();
    }

   /*onclick="window.location.reload();"*/
    onSubmitLog(e) {
        //console.log(e.value.password);
        /*this.postUser(e.value.email,e.value.password).subscribe(data => {
            console.log(data);

            this.user = data
        console.log(this.user);

        });*/

        this.http.post(/*"http://192.168.0.15/~user14/*/"http://gfl:8070/BOARDROOM_BOOKER/server/api/user/user/",
            {
        "email":  e.value.email,
        "password":  e.value.password
        })
        .subscribe(
            data  => {
                console.log("POST Request is successful ", data);
                if(Array.isArray(data)){
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

            console.log("Error", error);

            }

        );
    }
    

    ngOnInit(){
        //this.postUser('karina@gmail.com','111').subscribe(data => this.user = data);
    }

    /*submit(user: User){
        this.dataService.postData(user)
                .subscribe(
                    (data: User) => {this.receivedUser=data; this.done=true;},
                    error => console.log(error)
                );
    }*/

    public postUser(email, password){
        console.log(email+" "+password);
        const body = [{email: email}, {password: password}];
        return this.http.post(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/user/user/', body)
        .pipe(
            catchError(this.handleError)
          );
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
    };

   

}

