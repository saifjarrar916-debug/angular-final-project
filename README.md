# Titan Fitness — Angular Frontend

Frontend-only Titan Fitness Staff Portal built with Angular 20 standalone components.

## Data

There is **no backend** in this project.
All starter data is stored as JSON files in:

`src/assets/data/`

- `members.json`
- `classes.json`
- `trainers.json`
- `plans.json`
- `checkins.json`

Angular services load the JSON data into Signals and handle filtering, paging, create and update operations in browser memory.

> Changes made while the app is running are temporary and reset when the page is refreshed. The JSON files are the initial data source.

## Run

```bash
npm install
npm start
```

Then open:

`http://localhost:4200`

## Main Angular concepts used

- Standalone components
- Signals: `signal`, `computed`, `effect`
- Lazy-loaded routes
- Route parameters and query/filter state
- `@if` / `@for`
- Property and event binding
- `input()` / `output()`
- Injectable services + RxJS `of()` / `subscribe()` for the frontend mock data flow
- Custom directives
- Built-in and custom pipes
- Reusable components
- Angular Material `MatDialog`

No Node API, REST backend, database server, or HTTP interceptor is required.
