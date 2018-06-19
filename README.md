# Time Tracker

A web application designed to allow the user to add tasks and projects to a To-Do list, mark those tasks as complete, modify them, or remove them from the list. Each task is tied to a project, with the project page displaying a brief overview of how long it will take to complete given the current tasks.

https://time-tracker-project.herokuapp.com/#!/

## Built With

PostgreSQL, Express, AngularJS, node.js, Angular-Material, Angular-Route, Git, GitHub, Heroku

## Getting Started

Fork and Clone this repository
Run 'npm install'
    'npm start'

### Prerequisites

- [Node.js](https://nodejs.org/en/)


### Installing

```sql
CREATE TABLE "projects" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(200)
);

CREATE TABLE "entries" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(200),
	"date" DATE,
	"start_time" TIME,
	"end_time" TIME,
	"hours" VARCHAR(10),
	"project_id" INT REFERENCES "projects" ON DELETE CASCADE
);
);
```

### Completed Features

High level list of items completed.

- [x] Adding Projects
- [x] Adding Tasks
- [x] Graph displaying time in each project
- [x] Alert when overlapping schedule for tasks

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Multiple Users

## Authors

Kevin Dexter
