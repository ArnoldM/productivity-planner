import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellLayoutComponent } from './shell.layout.component';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ShellLayoutComponent', () => {
  let component: ShellLayoutComponent;
  let fixture: ComponentFixture<ShellLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
