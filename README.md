# Alfredo

Alfredo, colloquially known as "Al", is a locally-run agentic personal assistant.

## Purpose

Alfredo provides a broad array of features designed to aid the user in managing various aspects of life while maintaining data related to the user in an open and interoperable form, keeping it as local to the user's machine as possible. It uses third-party AI tooling and APIs for input and data processing, with the results and long-term data tracking stored in a local SQLite database.

## Key Features

- **Data Import**: Imports data from various sources, such as Email, Google Calendar, Apple Health, CSV, XML, and Google Sheets.
- **Event Lookahead**: Provides a look ahead at the expected events and activities for the day and week.
- **Proactive Planning**: Warns about upcoming time-consuming events, vacations, or visits that require planning and packing.
- **Goal Motivation**: Helps keep the user motivated with their personal health goals.
- **Task Reminders**: Ensures the user doesn't miss important tasks like yearly/quarterly taxes.

## Target Audience

This application is for technical users who are comfortable with file formats, API access tokens, and Progressive Web Applications (PWAs).

## Key Technologies

- **Angular PWA**: Built as a Progressive Web Application for mobile and desktop devices using Angular.
- **In-Browser Database**: Uses SQLite in the browser (via sql.js) to manage user and agent data.
- **Offline Support**: Designed to support offline usage as much as possible. Core features like timers and event tracking will work offline, while AI API calls will require an internet connection.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- [Angular CLI](https://angular.dev/tools/cli)

### Development Server

To start a local development server, run the following command in the `alfredo` directory:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building the Project

To build the project for production, run:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

To execute the unit tests via [Karma](https://karma-runner.github.io), run:

```bash
npm test
