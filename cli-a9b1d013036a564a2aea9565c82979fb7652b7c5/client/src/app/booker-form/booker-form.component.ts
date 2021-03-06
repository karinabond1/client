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

  public email;
  ismeridian: boolean = true;
  startTime: Date = new Date();
  endTime: Date = new Date();
  recurent = false;
  maxWeek = 0;
  public answer;
  public errorWeekly;
  public errorBiWeekly;
  public errorDayPick;
  public errorTimePick;
  public request;

  form = new FormGroup({
    dateYMD: new FormControl(),
    startTime: new FormControl(),
    endTime: new FormControl(),
    note: new FormControl(),
    rec: new FormControl(),
    numberWeeks: new FormControl(),
    numberWeeksBi: new FormControl()
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
  public dayTran = this.transfereService.getData();
  ngOnInit() {
    this.getUserInfo().subscribe(data => {
      this.email = data[0].email;

    });
    if (!this.dayTran) {
      this.form.setValue({ dateYMD: moment().format('YYYY-MM-DD'), startTime: this.startTime, endTime: this.endTime, note: "", rec: "", numberWeeks: 1, numberWeeksBi: 1 });
    } else {
      this.form.setValue({ dateYMD: this.dayTran.format('YYYY-MM-DD'), startTime: this.startTime, endTime: this.endTime, note: "", rec: "", numberWeeks: 1, numberWeeksBi: 1 });
    }

  }

  toggleMode(): void {
    this.ismeridian = !this.ismeridian;
  }

  public recEvent(bool) {
    this.recurent = bool;
  }


  async book() {
    this.request = "";
    this.errorBiWeekly = "";
    this.errorWeekly = "";
    this.errorDayPick = "";
    this.errorTimePick = "";
    let startMin = this.form.value.startTime.getMinutes();
    let endMin = this.form.value.endTime.getMinutes();
    let startHou = this.form.value.startTime.getHours();
    let endHou = this.form.value.endTime.getHours();
    if (this.form.value.startTime.getMinutes() < 1) {
      startMin = "00";
    }
    if (this.form.value.endTime.getMinutes() < 1) {
      endMin = "00";
    }
    if (this.form.value.startTime.getMinutes() < 10) {
      startMin = "0" + this.form.value.startTime.getMinutes();
    }
    if (this.form.value.endTime.getMinutes() < 10) {
      endMin = "0" + this.form.value.endTime.getMinutes();
    }
    if (this.form.value.startTime.getHours() < 10) {
      startHou = "0" + this.form.value.startTime.getHours();
    }
    if (this.form.value.endTime.getHours() < 10) {
      endHou = "0" + this.form.value.endTime.getHours();
    }
    let start = startHou + ":" + startMin + ":00";
    let end = endHou + ":" + endMin + ":00";
    let dateYM = this.form.value.dateYMD;
    let allDateYMD;
    if (typeof (dateYM) == 'string') {
      allDateYMD = dateYM;
    } else {
      let month;
      if ((dateYM.getMonth() + 1) < 10) {
        month = '0' + (dateYM.getMonth() + 1);
      } else {
        month = (dateYM.getMonth() + 1);
      }
      allDateYMD = dateYM.getFullYear() + "-" + month + "-" + dateYM.getDate();
    }
    let dayYMD = moment(allDateYMD);

    if (dayYMD.format('MM') < moment().format('MM')) {
      this.errorDayPick = "You have chosen the previous day!";
    } else if (dayYMD.format('ddd') == 'Sat' || dayYMD.format('ddd') == 'Sun' || (moment().format('L').slice(3).slice(0, 2) > dayYMD.format('DD') && dayYMD.format('MM') <= moment().format('MM'))) {
      this.errorDayPick = "You have chosen the weekend day or previous!";
    } else if ((moment().format('L').slice(3).slice(0, 2) > dayYMD.format('DD') && dayYMD.format('MM') <= moment().format('MM')) && (start < moment().format('HH:MM') || end < moment().format('HH:MM') || start > end)) {
      this.errorTimePick = "You have chosen the wrong time!";
    } else {

      let rec;
      let allDate;
      let dateY = this.form.value.dateYMD;
      if (typeof (dateY) == 'string') {
        allDate = dateY;
      } else {
        let month;
        if ((dateYM.getMonth() + 1) < 10) {
          month = '0' + (dateYM.getMonth() + 1);
        } else {
          month = (dateYM.getMonth() + 1);
        }
        allDate = dateY.getFullYear() + "-" + month + "-" + dateY.getDate();
      }
      if (!this.recurent) {
        rec = null;
        let somesss = await this.postCheckEvent(start, end, allDate, rec);

        if (somesss == 'yes') {
          this.postEvent(start, end, allDate, rec);
        } else {
          this.answer = somesss;
        }
      } else if (this.form.value.rec == "weekly") {
        if (this.form.value.numberWeeks > 4 || this.form.value.numberWeeks < 0) {
          this.errorWeekly = "You can set numbers only from 1 to 4 for weekly!";
        } else {
          let arrAnswerCheck = Array();
          let day = moment(this.form.value.dateYMD);
          let day2 = day;
          for (let i = 0; i <= this.form.value.numberWeeks; i++) {
            arrAnswerCheck.push(await this.postCheckEvent(start, end, day2.format('YYYY-MM-DD'), allDate));
            day2 = day2.add(7, 'days');
          }

          let bool = true;
          for (let i = 0; i < arrAnswerCheck.length; i++) {
            if (arrAnswerCheck[i] != 'yes') {
              bool = false;
            }
            if (!bool) {
              this.answer = arrAnswerCheck[i];
              break;
            }
          }
          if (bool) {
            let day3 = moment(this.form.value.dateYMD);
            for (let i = 0; i <= this.form.value.numberWeeks; i++) {
              this.postEvent(start, end, day3.format('YYYY-MM-DD'), allDate);
              day3 = day3.add(7, 'days');
            }
          }
        }

      } else if (this.form.value.rec == "bi_weekly") {
        if (this.form.value.numberWeeksBi > 2 || this.form.value.numberWeeksBi < 0) {
          this.errorBiWeekly = "You can set numbers only from 1 to 2 for bi-weekly!";
        } else {
          let arrAnswerCheck = Array();
          let dateY = this.form.value.dateYMD;
          let day = moment(this.form.value.dateYMD);
          let day2 = day;
          let allDate;
          if (typeof (dateY) == 'string') {
            allDate = dateY;
          } else {
            allDate = dateY.getFullYear() + "-" + (dateY.getMonth() + 1) + "-" + dateY.getDate();
          }
          for (let i = 0; i <= this.form.value.numberWeeksBi; i++) {
            arrAnswerCheck.push(await this.postCheckEvent(start, end, day2.format('YYYY-MM-DD'), allDate));
            day2 = day2.add('days', 14);
          }
          let bool = true;
          for (let i = 0; i < arrAnswerCheck.length; i++) {
            if (arrAnswerCheck[i] != 'yes') {
              bool = false;
            }
            if (!bool) {
              this.answer = arrAnswerCheck[i];
              break;
            }
          }
          if (bool) {
            for (let i = 0; i <= this.form.value.numberWeeksBi; i++) {
              this.postEvent(start, end, day2.format('YYYY-MM-DD'), allDate);
              day2 = day2.add('days', 14);
            }
          }
        }
      } else if (this.form.value.rec == "monthly") {
        let arrAnswerCheck = Array();
        let day1 = moment(this.form.value.dateYMD);
        let day11 = day1;
        arrAnswerCheck.push(await this.postCheckEvent(start, end, day1.format('YYYY-MM-DD'), day1.format('YYYY-MM-DD')));
        let day2 = day11.add('days', 31);
        let bool = true;
        while (bool) {
          if (day2.format('ddd') == 'Sat' || day2.format('ddd') == 'Sun') {
            day2 = day2.add('days', 1);
          } else {
            bool = false;
          }
        }
        arrAnswerCheck.push(await this.postCheckEvent(start, end, day2.format('YYYY-MM-DD'), day1.format('YYYY-MM-DD')));
        if (arrAnswerCheck[0] == 'yes' && arrAnswerCheck[1] == 'yes') {
          this.postEvent(start, end, day1.format('YYYY-MM-DD'), day1.format('YYYY-MM-DD'));
          this.postEvent(start, end, day2.format('YYYY-MM-DD'), day1.format('YYYY-MM-DD'))
        } else {
          this.answer = 'There is the same event on this day. Please, change it!';
        }
      } else {
        this.errorBiWeekly = "Choose recurency!";
      }

    }
  }


  async postCheckEvent(start, end, create_date, rec) {
    let bool;
    this.http.post(/*"http://192.168.0.15/~user14/*/"http://gfl:8070/BOARDROOM_BOOKER/server/api/calendar/checkEvent/",
      {
        'note': this.form.value.note,
        'start': start,
        'end': end,
        'user_id': localStorage.getItem('id'),
        'create_date': create_date,
        'recurent_id': rec,
        'room_id': localStorage.getItem('room_id')
      })
      .subscribe(

        data => {
          if (data != 'yes') {
            this.answer = data;
          }
          this.request = data;
          bool = data;

        },
        error => {
        })
    await this.delay();
    return bool;
  }

  private delay() {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(42);
      }, 200);
    });
  }

  private postEvent(start, end, create_date, rec) {
    let answ;
    this.http.post(/*"http://192.168.0.15/~user14/*/"http://gfl:8070/BOARDROOM_BOOKER/server/api/calendar/event/",
      {
        'note': this.form.value.note,
        'start': start,
        'end': end,
        'user_id': localStorage.getItem('id'),
        'create_date': create_date,
        'recurent_id': rec,
        'room_id': localStorage.getItem('room_id')
      })
      .subscribe(
        data => {
          this.answer = data;
        },
        error => {
        })
  }

  public getUserInfo() {
    return this.http.get(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/user/userInfo/' + localStorage.getItem('id'))
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
