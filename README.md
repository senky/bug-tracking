# Bug Tracking System for GoHealth assignment

## Quick Start

```
npm install
npm server:start
```

## Deployment

```
docker build -t gohealth .
docker run -p <your-desired-address>:<your-desired-port>:80 gohealth
// E.g. for localhost: docker run -p 127.0.0.1:3000:80 gohealth
```
