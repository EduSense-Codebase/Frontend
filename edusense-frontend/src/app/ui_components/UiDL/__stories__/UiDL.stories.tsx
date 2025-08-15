import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { UIDLRenderer } from '../index';

const meta = {
    title: 'Component/Button',
    component: UIDLRenderer,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const exampleUIDL = `
UI:
    Text welcomeMsg {
        value = "Welcome to the survey"
    }

    InputField nameInput {
        label = "Name"
        placeholder = "Enter your name"
        bind = $username
    }

    RadioField genderSelect {
        label = "Gender"
        options = ["Male", "Female", "Other"]
        bind = $selectedGender
    }

    Button submitBtn {
        label = "Submit"
        onClick = submitSurvey
    }

STATE:
    string username = ""
    string selectedGender = ""

DATASOURCE:
    questionBank = db.collection("questions")
`;

export const Test: Story = {
    args: {
        uidlText: exampleUIDL,
    },
};
