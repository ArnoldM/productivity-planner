import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../models/card.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-homepage-feature-card-list',
  standalone: true,
  imports: [NgClass],
  templateUrl: './homepage-feature-card-list.dumb.component.html',
  styleUrl: './homepage-feature-card-list.dumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'container d-flex column-gap-4',
  },
})
export class HomepageFeatureCardListDumbComponent {
  readonly cardList = input.required<Card[]>();
}
