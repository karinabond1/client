import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { initDayOfMonth } from "ngx-bootstrap/chronos/units/day-of-month";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Room } from './room.module';
import { Event } from './event.module';
import { catchError } from 'rxjs/operators';
import { throwError } from "rxjs";
import { TransferService } from '../transfer.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    public date = moment();

    public dateForm: FormGroup;

    public daysArr;

    public rooms: Room[];
    public events: Event[];
    public weekStart = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    public weekStartTrue = true;
    public idRoom;
    public year = this.date.format('YYYY');
    public month = this.date.format('MM');
    public eventTrue = true;
    public eventLast = true;
    public email;
    public eventCreatedDay;
    public recurentEvent = false;
    public ismeridian: boolean = true;
    public actionUser = true;
    public deleteAnswer;

    constructor(private fb: FormBuilder, private http: HttpClient, private transfereService: TransferService) {
        this.initDateForm();
    }

    public weekFromMon() {
        this.weekStart = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.weekStartTrue = false;
        this.daysArr = this.createCalender(this.date);
    }

    public weekFromSun() {
        this.weekStart = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekStartTrue = true;
        this.daysArr = this.createCalender(this.date);
    }

    public initDateForm() {
        return this.dateForm = this.fb.group({
            dateFrom: [null, Validators.required],
            dateTo: [null, Validators.required]
        });
    }

    public ngOnInit() {
        this.daysArr = this.createCalender(this.date);
        this.getRooms().subscribe(data => this.rooms = data);
    }

    public todayCheck(day) {
        if (!day) {
            return false;
        }
        return moment().format('L') === day.format('L');
    }

    public weekendCheck(day) {
        if (!day) {
            return false;
        }
        //console.log(day.format('ddd'));
        //console.log(moment().format('M'));
        //console.log(day.format('M'));
        if (day.format('MM') < moment().format('MM')) {
            return false;
        }

        if (day.format('ddd') == 'Sat' || day.format('ddd') == 'Sun' || (moment().format('L').slice(3).slice(0, 2) > day.format('DD') && day.format('MM') <= moment().format('MM'))) {
            return false;
        } else {
            return true;
        }
    }

    createCalender(month) {
        let week = 0;
        if (!this.weekStartTrue) {
            week = 1;
        }
        let firstDay = moment(month).startOf('M');
        let days = Array.apply(null, { length: month.daysInMonth() })
            .map(Number.call, Number)
            .map((n) => {
                return moment(firstDay).add(n, 'd');

            });
        for (let n = 0; n < firstDay.weekday() - week; n++) {
            days.unshift(null);
        }
        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
            if (data) {
                this.events = data;
            }
        });
        return days;
    }

    public nextMonth() {
        this.date.add(1, 'M');
        this.month = this.date.format('MM');
        this.year = this.date.format('YYYY');
        this.daysArr = this.createCalender(this.date);
    }

    public prevMonth() {
        this.date.subtract(1, 'M');
        this.month = this.date.format('MM');
        this.year = this.date.format('YYYY');
        this.daysArr = this.createCalender(this.date);
    }


    public selectedDate(day) {
        console.log("dd");
        console.log(day);
        this.transfereService.setData(day);
    }

    public chooseRoom(e) {
        this.idRoom = e.value.roomm;
        localStorage.setItem('room_id', e.value.roomm);
        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
            this.events = data;
            console.log(this.events);
            this.daysArr = this.createCalender(this.date);
        });
    }
    toggleMode(): void {
        this.ismeridian = !this.ismeridian;
    }

    public form = new FormGroup({
        startTime: new FormControl(),
        endTime: new FormControl(),
        note: new FormControl(),
        rec: new FormControl()
    });

    public showEventInfo(event) {
        this.deleteAnswer = "";
        this.eventLast = true;
        this.recurentEvent = false;
        this.actionUser = true;
        this.getUserInfo(event.user_id).subscribe(data => {
            this.email = data[0].email;
        });
        console.log(event);
        this.eventCreatedDay = event.create_date;
        if (event.recurent_id != null) {
            this.recurentEvent = true;
        }
        console.log(event.user_id + " " + localStorage.getItem('id'));
        if (event.user_id != localStorage.getItem('id')) {
            this.actionUser = false;
        }
        if(localStorage.getItem('role')=='admin'){
            this.actionUser = true;
        }
        localStorage.setItem('event_id', event.id);
        let startTime = new Date();
        let endTime = new Date();
        startTime.setHours(event.start.slice(0, 2));
        endTime.setHours(event.end.slice(0, 2));
        startTime.setMinutes(event.start.slice(3).slice(0, 2));
        endTime.setMinutes(event.end.slice(3).slice(0, 2));
        this.form.setValue({ startTime: startTime, endTime: endTime, note: event.note, rec: "" });
        if ((moment().format('L').slice(3).slice(0, 2) >= event.create_date.slice(8) && event.create_date.slice(5).slice(0, 2) <= moment().format('MM')) && (event.start.slice(0, 5) < moment().format('HH:MM') || event.end.slice(0, 5) < moment().format('HH:MM'))) {
            this.eventLast = false;
        } else {
            console.log('yes');
        }
    }

    public update() {
        let note = this.form.value.note;
        console.log(this.form.value);
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
        this.deleteAnswer = "";
        let rec = "-";
        if (this.form.value.rec === true) {
            rec = '+';
        }
        this.http.put("http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/event/", {
            start: start,
            end: end,
            note: this.form.value.note,
            id: localStorage.getItem('event_id'),
            rec: rec,
            room_id: localStorage.getItem('room_id')
        })
            .subscribe(
                data => {
                    console.log("POST Request is successful ", data);
                    console.log(data);
                    if (data === 'Ok!') {
                        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
                            this.events = data;
                            console.log(this.events);
                            this.daysArr = this.createCalender(this.date);
                        });
                    }
                    this.deleteAnswer = data;
                },
                error => {

                    console.log("Error", error);

                })
    }

    
    public delete() {
        this.deleteAnswer = "";
        let rec = "-";
        if (this.form.value.rec === true) {
            rec = '+';
        }
        this.http.delete("http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/event/" + localStorage.getItem('event_id') + "/" + rec
        )
            .subscribe(
                data => {
                    console.log("POST Request is successful ", data);
                    console.log(data);
                    if (data === 'Ok!') {
                        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
                            this.events = data;
                            console.log(this.events);
                            this.daysArr = this.createCalender(this.date);
                        });
                    }
                    this.deleteAnswer = data;
                },
                error => {

                    console.log("Error", error);

                })

    }

    public getUserInfo(id) {
        return this.http.get('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/user/userInfo/' + id)
            .pipe(
                catchError(this.handleError)
            );
    }




    public getRooms() {
        return this.http.get<Room[]>('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/rooms/')
            .pipe(
                catchError(this.handleError)
            );
    }

    public getEvents(roomId, month, year) {
        return this.http.get<Event[]>('http://192.168.0.15/~user14/BOARDROOM_BOOKER/server/api/calendar/eventsByMonth/' + roomId + '/' + month + '/' + year)
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
    }
}
