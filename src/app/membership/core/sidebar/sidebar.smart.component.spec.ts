import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSmartComponent } from './sidebar.smart.component';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SidebarSmartComponent', () => {
  let component: SidebarSmartComponent;
  let fixture: ComponentFixture<SidebarSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSmartComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
