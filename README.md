# Interview Scheduler

A single page React application that allows users to book and cancel interview appointments between Monday and Friday. Users are able to view the number of appointment slots available per day and can add appointments by choosing an empty time slot, inputting the interviewee name, and then selecting an interviewer. The user also has an option to edit existing interviews.

Multiple users of the application will see real-time synchronization of the schedule via WebSockets implementation.

All of the data is persisted by an API server using a PostgreSQL database. Unit testing, integration testing, and end-to-end testing done using Jest & Cypress.

## Final Product

Adding an appointment: 
![Adding appointment](https://camo.githubusercontent.com/4ce5a012fc0bfdcc6ac36efb9b15836bacf8d8f2/68747470733a2f2f692e6779617a6f2e636f6d2f66363735393932326465333234313532353035336536386535666662663564642e676966)

Canceling an appointment:
![Canceling appointment](https://camo.githubusercontent.com/befa505851b6082db39fb595e6a545b12408caf5/68747470733a2f2f692e6779617a6f2e636f6d2f65636138656536626231666661396336326664313930636634303662613637662e676966)

## Getting Started
Note: The [scheduler-api](https://github.com/kvsuen/scheduler-api) server will also need to be running. Both servers run concurrently; requests are proxied from the Webpack development server to the API server.

1. Install dependencies with `npm install`
2. Run the api server with `npm start`
3. Run the webpack developement server with `npm start`

- To check out the test framework, use `npm test` and `npm run cypress`
- To check out the storybook visual testbed, use `npm run storybook`

## Dependencies
    "axios": "^0.19.0",
    "classnames": "^2.2.6",
    "normalize.css": "^8.0.1",
    "react": "^16.9.0",
    "react-dom": "^16.9.0",
    "react-scripts": "3.0.0"