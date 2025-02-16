import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import SignupPageComponent from './signup.page.component';

const meta: Meta<SignupPageComponent> = {
  title: 'Sign-up/Signup-Page',
  component: SignupPageComponent,
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
type Story = StoryObj<SignupPageComponent>;

export const Empty: Story = {};
