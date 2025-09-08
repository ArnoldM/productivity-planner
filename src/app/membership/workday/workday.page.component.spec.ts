import { ComponentFixture, TestBed } from '@angular/core/testing';

import WorkdayPageComponent from './workday.page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WorkdayPageComponent', () => {
  let component: WorkdayPageComponent;
  let fixture: ComponentFixture<WorkdayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkdayPageComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkdayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
