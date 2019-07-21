import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from "rxjs";
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class AdminComponent implements OnInit {

  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private http: HttpClient) { }

  public allUsers;
  public showAddUser = false;
  public answer;
  public status = true;
  public idForDel;
  public idForUpd;
  public userInfo;
  public answerEdit;
  public form = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    role: new FormControl(),
    status: new FormControl()
  });


  ngOnInit() {
    this.answer = "";
    this.getAllUsers().subscribe(data => this.allUsers = data);
  }

  public addUser() {
    this.showAddUser = true;
  }

  public update() {
    this.answerEdit = "";
    let status;
    if(this.form.value.status=='existing'){
      status = 1;
    }else{
      status = 0;
    }
    this.udateUsers(this.idForUpd,this.form.value.name,this.form.value.email,this.form.value.password,this.form.value.role,status);
  }

  public delete() {
    this.deleteUser(this.idForDel);
  }

  public registrateUser(e) {
    this.postUser(e.value.nameR, e.value.emailR, e.value.passwordR, e.value.role);
  }

  public idForDelete(id)
  {
    this.idForDel = id;
  }
  public idForUpdate(id)
  {
    this.answerEdit = "",
    this.idForUpd = id;
    this.getUserById(id).subscribe(data=>{
      this.userInfo = data;
      let status;
      if(data[0].status==1){
        status = 'existing';
      }else{
        status = 'remote';
      }
      this.form.setValue({ name: data[0].name, email: data[0].email, password: data[0].password, role: data[0].role, status: status});
    });
    
  }

  public noDelete()
  {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  private getAllUsers() {
    return this.http.get(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/admin/allUsers/')
      .pipe(
        catchError(this.handleError)
      );
  }

  private getUserById(id) {
    return this.http.get(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/admin/userById/'+id)
      .pipe(
        catchError(this.handleError)
      );
  }

  

  private deleteUser(id) {
    this.answer="";
    this.http.delete(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/admin/user/' + id)
      .subscribe(
        data => {
          this.answer = data;
          this.getAllUsers().subscribe(data => this.allUsers = data);
        },
        error => {
        })
  }

  private udateUsers(id,name,email,password,role,status) {
    return this.http.put(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/admin/user/',
    {
      'id': id,
      'name': name,
      'email':email,
      'password':password,
      'role':role,
      'status':status
    })
      .subscribe(
        data => {
          this.answerEdit = data;
          if(data=='Ok!'){
            this.getAllUsers().subscribe(data => this.allUsers = data);
          }
          
        },
        error => {
        })
  }

  private postUser(name, email, password, role) {
    this.http.post(/*"http://192.168.0.15/~user14/*/"http://gfl:8070/BOARDROOM_BOOKER/server/api/admin/userInfo/",
      {
        'name': name,
        'email': email,
        'password': password,
        'role': role
      })
      .subscribe(
        data => {
          this.answer = data;
          if(data=='Ok!'){
            this.getAllUsers().subscribe(data => this.allUsers = data);
          }
          
        },
        error => {
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
