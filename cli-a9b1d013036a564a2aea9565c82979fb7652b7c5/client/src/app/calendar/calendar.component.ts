import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule} from '@angular/forms';
import {initDayOfMonth} from "ngx-bootstrap/chronos/units/day-of-month";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Room } from './room.module';
import { Event } from './event.module';
import { catchError } from 'rxjs/operators'; 
import { throwError } from "rxjs";
import { TransferService } from '../transfer.service';

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
    public weekStart = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    public weekStartTrue = true;
    public idRoom;
    public year = this.date.format('YYYY');
    public month = this.date.format('MM');
    public eventTrue = true;

    constructor(private fb: FormBuilder, private http: HttpClient, private transfereService:TransferService) {
        this.initDateForm();
    }

    public weekFromMon(){
        this.weekStart = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        this.weekStartTrue = false;
        this.daysArr = this.createCalender(this.date);
    }

    public weekFromSun(){
        this.weekStart = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        this.weekStartTrue = true;
        this.daysArr = this.createCalender(this.date);
    }

    public initDateForm(){
        return this.dateForm = this.fb.group({
            dateFrom: [null, Validators.required],
            dateTo: [null, Validators.required]
        });
    }

    public ngOnInit() {
        this.daysArr = this.createCalender(this.date);
        this.getRooms().subscribe(data => this.rooms = data);
    }

    public todayCheck(day){
        if(!day){
            return false;
        }
        return moment().format('L') === day.format('L');
    }

    public weekendCheck(day){
        if(!day){
            return false;
        }
        //console.log(day.format('ddd'));
        //console.log(moment().format('M'));
        //console.log(day.format('M'));
        if(day.format('MM')<moment().format('MM')){
            return false;
        }
        
        if( day.format('ddd')=='Sat' || day.format('ddd')=='Sun' || (moment().format('L').slice(3).slice(0,2) > day.format('DD') && day.format('MM')<=moment().format('MM'))){
            return false;
        }else{
            return true;
        }
    }

    createCalender(month) {
        let week = 0;
        if(!this.weekStartTrue){
            week = 1;
        }
        let firstDay = moment(month).startOf('M');
        let days = Array.apply(null, {length: month.daysInMonth()})
            .map(Number.call, Number)
            .map((n) => {
                return moment(firstDay).add(n, 'd');
                
            });
        for (let n = 0; n < firstDay.weekday()-week; n++) {
            days.unshift(null);
        }
        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
            if(data){
                this.events = data;
                //console.log(this.events);
            }
            
            //this.daysArr = this.createCalender(this.date);
        });
        /*for (let i = 1; i < days.length; i++) {
            //console.log(days[n].format('YYYY-MM-DD'));
            if(this.events){
                for (let j = 0; j < this.events.length; j++) {
                    if(days[i].format('YYYY-MM-DD')==this.events[j].create_date){
                        console.log(this.events[j].start+"-"+this.events[j].end);
                        days[i].push(this.events[j].end);
                        console.log(days[i]);
                    }
                    //console.log(this.events[j].create_date);
                }
            }           
            
        }*/
        /*days.forEach(day=> {
            console.log(day.moment());
        });*/
        //console.log(days[1].format('YYYY-MM-DD'));
        return days;
    }

    public nextMonth(){
        this.date.add(1,'M');
        this.month = this.date.format('MM');
        this.year = this.date.format('YYYY');
        this.daysArr=this.createCalender(this.date);
    }

    public prevMonth(){
        this.date.subtract(1,'M');
        this.month = this.date.format('MM');
        this.year = this.date.format('YYYY');
        this.daysArr=this.createCalender(this.date);
    }


    public selectedDate(day){
        console.log("dd");
        console.log(day);
        this.transfereService.setData(day);
        /*let dayFormated = day.format('MM/DD/YYYY');
        if(this.dateForm.valid){
            this.dateForm.setValue({dateFrom: null, dateTo:null})
        }
        if(!this.dateForm.get('dateFrom').value){
            this.dateForm.get('dateFrom').patchValue(dayFormated);
        }else{
            this.dateForm.get('dateTo').patchValue(dayFormated);
        }*/
    }

    public chooseRoom(e){
        //console.log(e.value.roomm);
        this.idRoom = e.value.roomm;
        localStorage.setItem('room_id', e.value.roomm);
        //console.log(this.date.format('YYYY')+" "+this.date.format('MM'));
        this.getEvents(this.idRoom, this.month, this.year).subscribe(data => {
            this.events = data;
            console.log(this.events);
            this.daysArr = this.createCalender(this.date);
        });
        
        //console.log(this.events);
        //setTimeout(function() { console.log(this.events); }, 1000);
    }

    public getRooms(){
        return this.http.get<Room[]>(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/calendar/rooms/')
        .pipe(
            catchError(this.handleError)
          );
    }

    public getEvents(roomId, month, year){
        return this.http.get<Event[]>(/*'http://192.168.0.15/~user14/*/'http://gfl:8070/BOARDROOM_BOOKER/server/api/calendar/eventsByMonth/'+roomId+'/'+month+'/'+year)
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
