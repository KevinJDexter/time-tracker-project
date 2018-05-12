--------------sql queries:--------------

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

---------------sql queries end----------
