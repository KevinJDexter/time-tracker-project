const Pool = require('pg').Pool;
const url = require('url');

let config;

if (process.env.DATABASE_URL) {
  let params = url.parse(process.env.DATABASE_URL);
  let auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
    max: 10,
    idleTimeoutMillis: 30000
  };
} else {
  config = {
    post: 'localhost',
    database: 'time_tracker',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
  };
}

const pool = new Pool (config);

pool.on('connect', (client) => {
  console.log('postgresql connected!');
});

pool.on('error', (error, client) => {
  console.log('Unexpected Error connecting to Postgresql', error);
  process.exit(-1);
});

module.exports = pool;