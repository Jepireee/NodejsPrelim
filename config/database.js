const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6683428',
  password: 'feExfcMlVp',
  database: 'sql6683428',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = db;
