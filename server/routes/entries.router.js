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
    ("name", "date", "start_time", "end_time", "project_id")
    VALUES ($1, $2, $3, $4, $5);
  `, [entry.name, entry.date, entry.start_time, entry.end_time, entry.project_id])
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

module.exports = router;