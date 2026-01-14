# Instruction

This file provides the instructions for the task of creating the frontend UI for the "quick actions" feature

## Overview

The quick actions feature is where users, specifically, teachers, can select from a list of pre-set actions and quickly query the teaching assistant.

Some examples of quick actions include:

- Check-in Assignment
- Assignment rubric
- Lesson Notes
- Study guide

When any of these are clicked a modal will pop up asking for the user to enter in the specifics of the action. For example, for quick check-in, it will ask the topic of the assessment number of questions, etc.

Then when this information is submitted, the chat window will open and pre-fill in all of the information in the chat, allowing user to send the prompt

## Task

Your task is to create a mock frontend UI with dummy data that will implement this feature. You do not need to implement any api calls yet, just pure frontend components.

The way this should be implemented is in the following manner, the order is up to you:


- Create a new tab in the CourseHomePageUIController.tsx file called quick actions.
- The actual functionality should be in a QuickActionsTab.tsx file which will be in the ui_components folder. The structure of this should be similar to other ui_components, where there is a folder inside ui_components called QuickActionsTab, and within that folder there is a .scss file for styling and and index.tsx where the main component will reside
- The style and visual apperance of the component should be added in the .scss file, and should follow the theme in variables.scss
- In the quick actions tab, there should be a list of dummy quick actions
- When a quick action is clicked, it should open up a modal which will prompt the user to fill in some final information
- When it is submitted the chatbot should open and fill in a template prompt for the respective quick action, filled in with the user information