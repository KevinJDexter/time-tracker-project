const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const ProjectRouter = require('./routes/projects.router');
const EntryRouter = require('./routes/entries.router');

app.use(express.static('server/public'));
app.use(bodyParser.json());

app.use('/project', ProjectRouter);
app.use('/entry', EntryRouter);

app.listen(PORT, () => {
  console.log('listening on port', PORT);
})