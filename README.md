# Interview Scheduler

A single page React application that allows users to book and cancel interview appointments between Monday and Friday. Users are able to view the number of appointment slots available per day and can add appointments by choosing an empty time slot, inputting the interviewee name, and then selecting an interviewer. The user also has an option to edit existing interviews.

Multiple users of the application will see real-time synchronization of the schedule via WebSockets implementation.

All of the data is persisted by an API server using a PostgreSQL database. Unit testing, integration testing, and end-to-end testing done using Jest & Cypress.

## Final Product

Adding an appointment: 
![Adding appointment](https://i.gyazo.com/f6759922de3241525053e68e5ffbf5dd.gif)

Canceling an appointment:
![Canceling appointment](https://i.gyazo.com/eca8ee6bb1ffa9c62fd190cf406ba67f.gif)

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