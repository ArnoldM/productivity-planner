import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeBannerDumbComponent } from './home-banner.dumb.component';
import { faker } from '@faker-js/faker';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HomeBannerDumbComponent', () => {
  let component: HomeBannerDumbComponent;
  let fixture: ComponentFixture<HomeBannerDumbComponent>;
  const title = faker.lorem.text();
  const description = faker.lorem.paragraph();
  const button = faker.lorem.words();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomeBannerDumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBannerDumbComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', title);
    fixture.componentRef.setInput('description', description);
    fixture.componentRef.setInput('button', button);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const titleElement = fixture.debugElement.query(
      By.css('[data-testId="homeBannerTitle"]'),
    ).nativeElement;
    expect(titleElement.textContent).toContain(title);
  });
  it('should display description', () => {
    const descriptionElement = fixture.debugElement.query(
      By.css('[data-testId="homeBannerDescription"]'),
    ).nativeElement;
    expect(descriptionElement.textContent).toContain(description);
  });

  describe('button', () => {
    let buttonFixture: DebugElement;

    beforeEach(waitForAsync(() => {
      buttonFixture = fixture.debugElement.query(
        By.css('[data-testId="homeBannerButton"]'),
      );
    }));

    it('should be displayed', () => {
      expect(buttonFixture.nativeElement.textContent).toContain(button);
    });
    it('should trigger event on click', () => {
      let wasClicked = false;
      component.clicked.subscribe(() => {
        wasClicked = true;
      });

      buttonFixture.triggerEventHandler('click');
      expect(wasClicked).toBe(true);
    });
  });
});
