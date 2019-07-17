import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {Routes, RouterModule} from "@angular/router";
import {AlertModule, ButtonsModule, BsDropdownModule, CollapseModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {removeNgStyles, createNewHosts, createInputTransfer} from '@angularclass/hmr';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UserComponent} from './user/user.component';
import {CalendarComponent} from './calendar/calendar.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { RoutingModule } from './routing/routing.module';
import { AdminComponent } from './admin/admin.component';
import { DialogComponent } from './dialog/dialog.component';
import { BookerFormComponent } from './booker-form/booker-form.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
    {path: '', component: UserComponent},
    { path: 'calendar', component: CalendarComponent} ,
    { path: 'admin', component: AdminComponent },
    { path: 'calendar/booker_form', component: BookerFormComponent },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        CalendarComponent,
        NotFoundComponent,
        AdminComponent,
        DialogComponent,
        BookerFormComponent
    ],
    imports: [
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot(appRoutes),
        RoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        BrowserAnimationsModule,
        TimepickerModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
