import { Component, signal } from '@angular/core';
import { Card } from './models/card.interface';
import { HomeBannerDumbComponent } from './home-banner/home-banner.dumb.component';
import { HomepageFeatureCardListDumbComponent } from './homepage-feature-card-list/homepage-feature-card-list.dumb.component';

@Component({
  standalone: true,
  imports: [HomeBannerDumbComponent, HomepageFeatureCardListDumbComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  readonly cardList = signal<Card[]>([
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
  ]);

  readonly banner = signal({
    title: 'La productivité au XXIème siècle',
    description: "Atteignez plus d'objectifs en moins de temps.",
    button: 'Terminez vos journées en héro',
  });
}
