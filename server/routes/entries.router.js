const router = require('express').Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
  pool.query(`
    SELECT * FROM "entries";
  `)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((error) => {
      console.log('Error in GET /entry:', error);
      res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
  const entry = req.body;
  pool.query(`
    INSERT INTO "entries"
    ("name", "date", "start_time", "end_time", "project_id", "hours")
    VALUES ($1, $2, $3, $4, $5, $6);
  `, [entry.name, entry.date, entry.start_time, entry.end_time, entry.project_id, entry.hours])
    .then(() => {
      res.sendStatus(202);
    })
    .catch((error) => {
      console.log('Error in POST /entry:', error);
      res.sendStatus(500);
    })
});

router.delete('/:id', (req, res) => {
  pool.query(`
    DELETE FROM "entries"
    WHERE "id" = $1;
  `, [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error in DELETE /entry:', error);
      res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
  let entry = req.body;
  pool.query(`
    UPDATE "entries"
    SET "name" = $1, "date" = $2, "start_time" = $3, 
      "end_time" = $4, "project_id" = $5, "hours" = $6
    WHERE "id" = $7;
  `, [entry.name, entry.date, entry.start_time, entry.end_time, 
    entry.project_id, entry.hours, req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error in PUT /project', error);
      res.sendStatus(500);
    })
})

module.exports = router;