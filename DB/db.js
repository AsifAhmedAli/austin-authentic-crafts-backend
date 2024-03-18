// const mysql = require("mysql");
// require("dotenv").config();
// // const connection = () => {
// const db = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.pass,
//   database: process.env.dbname,
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to DB!");
// });
// // };

// module.exports = db;

// const mysql = require("mysql");
// require("dotenv").config();

// Create a connection for the database
// const db = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.pass,
//   database: process.env.dbname,
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to authentic crafts DB!");
// });


const mysql = require("mysql2");
require("dotenv").config();
// const connection = () => {
  const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.dbname,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

// Create a connection for the omni-channel database
// const omniChannelDB = mysql.createConnection({
//   host: process.env.omniChannelHost,
//   user: process.env.omniChannelUser,
//   password: process.env.omniChannelPass,
//   database: process.env.omniChannelDBName,
// });

// omniChannelDB.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to omni-channel DB!");
// });

module.exports = db;
