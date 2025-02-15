import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { HeaderComponent } from './header.smart.component';
import { provideRouter } from '@angular/router';

const meta: Meta<HeaderComponent> = {
  title: 'Shared/Header-Smart',
  component: HeaderComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
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
type Story = StoryObj<HeaderComponent>;

export const Empty: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const navBarTitle = canvas.getByTestId('navbarTitle');
    const loginLink = canvas.getByTestId('loginLink');
    const signupLink = canvas.getByTestId('signupLink');
    const homeLink = canvas.getByTestId('homeLink');
    await expect(navBarTitle.textContent).toBe('Productivity Planner');
    await expect(loginLink).toBeInTheDocument();
    await expect(signupLink).toBeInTheDocument();
    await expect(homeLink).toBeInTheDocument();
  },
};
