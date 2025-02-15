import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { HomepageFeatureCardListDumbComponent } from './homepage-feature-card-list.dumb.component';
import { Card } from '../models/card.interface';

const cardList: Card[] = [
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

const meta: Meta<HomepageFeatureCardListDumbComponent> = {
  title: 'Home-Page/Homepage-Feature-Card-List-Dumb',
  component: HomepageFeatureCardListDumbComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
    moduleMetadata({
      imports: [],
    }),
  ],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
};

export default meta;
type Story = StoryObj<HomepageFeatureCardListDumbComponent>;

export const NoCard: Story = {
  args: {
    cardList: [],
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const cards = canvas.queryAllByTestId('homepageFeatureCard');
    await expect(cards.length).toBe(0);
  },
};

export const ThreeCards: Story = {
  args: {
    cardList,
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const titles = canvas.queryAllByTestId('homepageFeatureCardTitle');
    await expect(titles.length).toBe(3);
    for (const [index, title] of titles.entries()) {
      await expect(title.textContent).toContain(cardList[index].name);
    }

    const descriptions = canvas.queryAllByTestId('homepageFeatureCardDescription');
    await expect(descriptions.length).toBe(3);
    for (const [index, description] of descriptions.entries()) {
      await expect(description.textContent).toContain(cardList[index].description);
    }

    const icons = canvas.queryAllByTestId('homepageFeatureCardIcon');
    await expect(icons.length).toBe(3);
    for (const [index, icon] of icons.entries()) {
      await expect(icon.getAttribute('class')).toContain(cardList[index].icon);
      await expect(icon).toBeVisible();
    }
  },
};
