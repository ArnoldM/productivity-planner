import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageFeatureCardListDumbComponent } from './homepage-feature-card-list.dumb.component';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

describe('HomepageFeatureCardListDumbComponent', () => {
  let component: HomepageFeatureCardListDumbComponent;
  let fixture: ComponentFixture<HomepageFeatureCardListDumbComponent>;
  const cardList = [
    {
      name: 'Planifier sa semaine',
      description: 'Visibilité sur les 7 prochains jours',
      icon: 'bi-calendar-heart-fill',
    },
    {
      name: 'Atteindre ses objectifs',
      description: 'Priorisation des tâches',
      icon: 'bi-trophy-fill',
    },
    {
      name: 'Analyser sa productivité',
      description: 'Visualiser le travail accompli',
      icon: 'bi-bar-chart-line-fill',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageFeatureCardListDumbComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageFeatureCardListDumbComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cardList', cardList);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of feature cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('[data-testId="homepage-feature-card"]'));
    expect(cards.length).toBe(3);
  });
  it('should display nothing if feature list is empty', () => {
    fixture.componentRef.setInput('cardList', []);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('[data-testId="homepage-feature-card"]'));

    expect(cards.length).toBe(0);
  });
  it('should display titles in each card', () => {
    const titles = fixture.debugElement.queryAll(
      By.css('[data-testId="homepage-feature-cardTitle"]'),
    );
    titles.forEach((title, index) => {
      expect(title.nativeElement.textContent).toContain(cardList[index].name);
    });
  });
  it('should display icons in each card', () => {
    const icons = fixture.debugElement.queryAll(
      By.css('[data-testId="homepage-feature-card-icon"]'),
    );
    icons.forEach((icon, index) => {
      expect(icon.nativeElement.getAttribute('class')).toContain(cardList[index].icon);
    });
  });
  it('should display descriptions in each card', () => {
    const descriptions = fixture.debugElement.queryAll(
      By.css('[data-testId="homepage-feature-card-description"] small'),
    );
    descriptions.forEach((description, index) => {
      expect(description.nativeElement.textContent).toContain(cardList[index].description);
    });
  });
});
