import { ComponentFixture, TestBed } from '@angular/core/testing';

import PlanningPageComponent from './planning.page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PlanningPageComponent', () => {
  let component: PlanningPageComponent;
  let fixture: ComponentFixture<PlanningPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningPageComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
