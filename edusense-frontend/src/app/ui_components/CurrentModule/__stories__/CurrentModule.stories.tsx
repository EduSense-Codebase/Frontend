import type { Meta, StoryObj } from "@storybook/react";
import CurrentModule from "../CurrentModule";

const meta: Meta<typeof CurrentModule> = {
  title: "Widgets/CurrentModule",
  component: CurrentModule,
};

export default meta;

type Story = StoryObj<typeof CurrentModule>;

export const Default: Story = {
  args: {
    moduleName: "Unit 1 – Grammar",
    icon: "📘",
  },
};

export const WithDifferentIcon: Story = {
  args: {
    moduleName: "Unit 2 – Vocabulary",
    icon: "📝",
  },
};
