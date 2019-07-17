import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TransferService } from '../transfer.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from "rxjs";
import * as moment from 'moment';


@Component({
  selector: 'app-booker-form',
  templateUrl: './booker-form.component.html',
  styleUrls: ['./booker-form.component.css']
})
export class BookerFormComponent implements OnInit {

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minTime: Date = new Date();
  maxTime: Date = new Date();
  public dayTran = this.transfereService.getData();
  public email;
  ismeridian: boolean = true;
  startTime: Date = new Date();
  endTime: Date = new Date();
  recurent = false;
  maxWeek = 0;

  form = new FormGroup({
    dateYMD: new FormControl(),
    startTime: new FormControl(),
    endTime: new FormControl(),
    note: new FormControl(),
    rec: new FormControl(),
    numberWeeks: new FormControl()
  });

  constructor(private transfereService: TransferService, private http: HttpClient) {
    this.minTime.setHours(7);
    this.minTime.setMinutes(59);
    this.minTime.setSeconds(0);
    this.maxTime.setHours(20);
    this.maxTime.setMinutes(1);
    this.maxTime.setSeconds(0);
    this.startTime.setHours(8);
    this.startTime.setMinutes(0);
    this.startTime.setSeconds(0);
    this.endTime.setHours(20);
    this.endTime.setMinutes(0);
    this.endTime.setSeconds(0);
    this.maxWeek = 4;

  }

  ngOnInit() {
    this.getUserInfo().subscribe(data => {
      //console.log(data[0].email);
      this.email = data[0].email;

    });
    if (!this.dayTran) {
      this.form.setValue({ dateYMD: moment().format('YYYY-MM-DD'), startTime: this.startTime, endTime: this.endTime, note: "", rec: "", numberWeeks: "" });
    } else {
      this.form.setValue({ dateYMD: this.dayTran.format('YYYY-MM-DD'), startTime: this.startTime, endTime: this.endTime, note: "", rec: "", numberWeeks: "" });
    }

  }



  /*public startTime: Date = new Date();
  public endTime: Date = new Date();*/

  toggleMode(): void {
    this.ismeridian = !this.ismeridian;
  }

  public recEvent(bool) {
    this.recurent = bool;
  }


  public book() {
    console.log(this.form.value);
    //console.log(this.form.value.startTime.getHours()+" "+this.form.value.startTime.getMinutes());
    let startMin = this.form.value.startTime.getMinutes();
    let endMin = this.form.value.endTime.getMinutes();
    let startHou = this.form.value.startTime.getHours();
    let endHou = this.form.value.endTime.getHours();
    if(this.form.value.startTime.getMinutes()<1){
      startMin = "00";
    }
    if(this.form.value.endTime.getMinutes()<1){
      endMin = "00";
    }
    if(this.form.value.startTime.getHours()<10){
      startHou = "0"+this.form.value.startTime.getHours();
    }
    if(this.form.value.endTime.getHours()<10){
      endHou = "0"+this.form.value.endTime.getHours();
    }
    let start = startHou+":"+startMin+":00";
    let end = endHou+":"+endMin+":00";
    console.log(start+" "+end);
    let rec;
    if(!this.recurent){
      rec = "";
    }else if(this.form.value.rec=="weekly" && this.form.value.numberWeeks<5 && this.form.value.numberWeeks>0){
      let day = moment(this.form.value.dateYMD);
      let day2 = day.add('days',7*this.form.value.numberWeeks);      
      //let day2 = day.add('days',7);
      console.log(day2);
    }
    this.http.post("http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/event/",
      {
        'note': this.form.value.note,
        'start': start,
        'end': end,
        'user_id': localStorage.getItem('id'),
        'create_date': this.form.value.dateYMD,
        'recurent_id': rec,
        'room_id': localStorage.getItem('room_id')
      })
      .subscribe(
        data => {
          console.log("POST Request is successful ", data);
          /*if (Array.isArray(data)) {
            this.user = data;
            localStorage.setItem('id', data[0]['id']);
            localStorage.setItem('name', data[0]['name']);
            localStorage.setItem('status', data[0]['status']);
            localStorage.setItem('role', data[0]['role']);
            this.name = localStorage.getItem('name');
            window.location.reload();
          } else {
            e.value.email = '';
            e.value.password = '';
            this.error = "Email and/or password is incorrect!";
          }*/

        },
        error => {

          console.log("Error", error);

        })
  }




  public postEvent(note, start, end, user_id, create_date, recurent, room_id) {
    const body = [{ note: note }, { start: start }
      , { end: end }, { user_id: user_id }
      , { create_date: create_date }, { recurent_d: recurent }
      , { room_id: room_id }];
    return this.http.post('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/event/', body)
      .pipe(
        catchError(this.handleError)
      );
  }


  public getUserInfo() {
    return this.http.get('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/user/userInfo/' + localStorage.getItem('id'))
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
