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
      console.log('Error in GET /entries:', error);
      res.sendStatus(500);
    })
})

module.exports = router;