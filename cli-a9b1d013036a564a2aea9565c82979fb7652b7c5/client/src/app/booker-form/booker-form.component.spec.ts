import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookerFormComponent } from './booker-form.component';

describe('BookerFormComponent', () => {
  let component: BookerFormComponent;
  let fixture: ComponentFixture<BookerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
