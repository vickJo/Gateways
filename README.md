# INSTALLATION GUIDE

This project is in two parts:

- the Frontend (built with React)
- the Service (built with Express)

## The Service

The Service is built using Express and saves data to a [MongoDB](https://docs.mongodb.com/manual/installation/) instance. Before starting the service locally, make sure you have mongodb installed on your machine.

**The app will attempt to connect to the DB using: `mongodb://127.0.0.1:27017/msoft` connection string**

Navigate to the service directory by running:

### `cd service`

Install dependencies:

### `npm install` or `yarn`

To run the unit tests, run:

### `npm run test` or `yarn test`

Start the application (runs in [http://localhost:5000](http://localhost:5000))

### `npm start` or `yarn start`

## The Frontend App

The fronted is a [React](https://reactjs.org/) App using [Material UI](https://mui.com/) as CSS Framework with [React Router](https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md) for navigation

Navigate to the app directory (from the root of the application):

### `cd app`

Install dependencies:

### `npm install` or `yarn`

To run the unit tests, run:

### `npm run test` or `yarn test`

Start the application (runs in [http://localhost:3000](http://localhost:3000))

### `npm start` or `yarn start`
