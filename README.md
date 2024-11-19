# Bug Tracking System for GoHealth assignment

## Quick Start

```
npm install
npm server:dev
npm client:dev
```

## Overview

This repo contains two separate apps that together form a bug tracking system:

1. REST API in `server` directory.
2. Pure React frontend in `client` directory.

### Server

REST API is build on top of Node.js (with TypeScript) and Express.js. To persist data, the API offers two adapters out of the box: CSV and in-memory. More can easily be added by implementing `StorageAdapter` interface. CSV adapter is used by default.

API exposes two endpoints:

1. `POST /create` to create new issue.
2. `PUT /close` to close existing issue.

As of now, there are no other endpoints that would list issues or allow other operations (such as edit).

### Client

React frontend uses TypeScript, too. It is built using vite. There is no state management library used since the only operations this app executes are reactions (`onSubmit` events) and there is no need for the state at all.

### Testing

The testing library of choice is Vitest. Simply run:

```
npm run test
```

to run both server and client tests.

## Deployment

Whole app is encapsulated in Docker. Server sits at non-public port 3000 while client is served via Nginx at public port 80. Nginx serves as a proxy to the server via `/api/` sub-routes.

To build production-ready image locally, run:

```
docker build -t gohealth .
docker run -p <your-desired-address>:<your-desired-port>:80 gohealth
// E.g. for localhost: docker run -p 127.0.0.1:3000:80 gohealth
```

To ssh into your container (for example to see contents of `server/storage-adapters/csv/issues.csv`), run:

```
docker ps
```

get container ID or name, and then:

```
docker exec -it <container-id-or-name> /bin/bash
```
