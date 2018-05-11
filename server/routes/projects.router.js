const router = require('express').Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
  pool.query(`
    SELECT * FROM "projects";
  `)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((error) => {
      console.log('error in GET /project', error);
      res.sendStatus(500);
    })
})

router.post('/', (req, res) => {
  const project = req.body;
  pool.query(`
    INSERT INTO "projects" ("name")
    VALUES ($1);
  `, [project.name])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error in POST /project', error);
      res.sendStatus(500);
    })
})

router.delete('/:id', (req, res) => {
  pool.query(`
    DELETE FROM "projects"
    WHERE "id" = $1;
  `, [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error in DELETE /project', error);
      res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
  pool.query(`
    UPDATE "projects"
    SET "name" = $1
    WHERE "id" = $2
  `, [req.body.name, req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error in PUT /project', error);
      res.sendStatus(500);
    })
})

module.exports = router;