import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { HomeBannerDumbComponent } from './home-banner.dumb.component';

const meta: Meta<HomeBannerDumbComponent> = {
  title: 'Home-Page/Home-Banner-Smart',
  component: HomeBannerDumbComponent,
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
type Story = StoryObj<HomeBannerDumbComponent>;

export const Empty: Story = {
  args: {
    title: 'La productivité au XXIème siècle',
    description: "Atteignez plus d'objectifs en moins de temps.",
    button: 'Terminez vos journées en héro',
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const homeBannerTitle = canvas.getByTestId('homeBannerTitle');
    const homeBannerDescription = canvas.getByTestId('homeBannerDescription');
    const homeBannerButton = canvas.getByTestId('homeBannerButton');

    await expect(homeBannerTitle).toBeInTheDocument();
    await expect(homeBannerTitle.textContent).toBe(Empty.args!.title);
    await expect(homeBannerDescription).toBeInTheDocument();
    await expect(homeBannerDescription.textContent).toBe(
      Empty.args!.description,
    );
    await expect(homeBannerButton).toBeInTheDocument();
    await expect(homeBannerButton.textContent).toBe(Empty.args!.button);
  },
};
