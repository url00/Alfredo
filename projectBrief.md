# Alfredo
A locally ran agentic personal assistant. Colloquially known as "Al".

## Purpose
Provides a broad array of features designed to aid the user in managing various aspects of life while maintaining data related to the user in an open and interoperable form as local to the users' machine as possible.
Uses third-party AI tooling and APIs for input and data processing such as GPT3, Gemini, etc. with the results and long-term data tracking stored in a SQLite database for further local processing.

## Key features
- Imports data from various sources, such as:
  - Email
  - Google Calendar
  - Apple Health
  - CSV
  - XML
  - Google Sheets
- Provides a look ahead at the expected events and activities for the day and week ahead.
- Warns about time-consuming events, vacations, visits, etc which are coming up and have not been sufficiently planned and packed for.
- Keeps the user motivated with their personal health goals.
- Helps the user not miss important tasks such as yearly/quarterly taxes.

## Target audience
- Technical users who understand file-formats, API access tokens, and PWAs.

## Key technologies
- Progressive web applications for mobile and desktop devices.
- SQLite in browser for managing the user's data as well as the agent's.
- Should support offline usage as much as possible, things like timers, event tracking should still work but making AI API calls will not.
- Should use Angluar with the `@angular/pwa` package for PWA support.

## Areas of difficulty
PWAs on iOS are known for being especially hard to execute on.
Long running tasks like this application tend to not go well since the PWA can be "slept" at any time.
Special care will need to be taken to ensure that important things like events and reminders are sent.
Push notifications on iOS for PWAs are a relatively new feature and require special handling.