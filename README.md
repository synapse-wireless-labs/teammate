# teammate

### Projects

#### Microsoft Graph Connector

Connector library to get calendar events from a user's Outlook calendar

To start the project, run `yarn start:msft-graph-connector` from the root of this project. Sources are in `./projects/msft-graph-connector`.

#### Github Graph Connector

Connector library to get pull requests and build statuses for a user's repos

To start the project, run `yarn start:github-graph-connector` from the root of this project. Sources are in `./projects/github-graph-connector`.

#### Desktop App

App used to connect to and configure a Teammate device. To run this project, first you have to start the UI development server:

```sh
cd ./projects/desktop-ui
yarn start
```

Then start the Electron app from the root of the repo:

```sh
yarn start:desktop
```
