import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBannerDumbComponent } from './home-banner.dumb.component';
import { faker } from '@faker-js/faker';
import { By } from '@angular/platform-browser';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';

describe('HomeBannerDumbComponent', () => {
  let component: HomeBannerDumbComponent;
  let fixture: ComponentFixture<HomeBannerDumbComponent>;
  const title = faker.lorem.text();
  const description = faker.lorem.paragraph();
  const button = faker.lorem.words();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBannerDumbComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBannerDumbComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', title);
    fixture.componentRef.setInput('description', description);
    fixture.componentRef.setInput('button', button);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const titleElement = fixture.debugElement.query(
      By.css('[data-testId="home-banner-title"]'),
    ).nativeElement;
    expect(titleElement.textContent).toContain(title);
  });
  it('should display description', () => {
    const descriptionElement = fixture.debugElement.query(
      By.css('[data-testId="home-banner-description"]'),
    ).nativeElement;
    expect(descriptionElement.textContent).toContain(description);
  });

  describe('button', () => {
    let buttonFixture: DebugElement;

    beforeEach(async () => {
      buttonFixture = fixture.debugElement.query(By.css('[data-testId="home-banner-button"]'));
    });

    it('should be displayed', () => {
      expect(buttonFixture.nativeElement.textContent).toContain(button);
    });
    it('should trigger event on click', () => {
      jest.spyOn(component.clicked, 'emit');

      buttonFixture.nativeElement.click();

      expect(component.clicked.emit).toHaveBeenNthCalledWith(1);
    });
  });
});
