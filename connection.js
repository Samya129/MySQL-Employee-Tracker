// Import the mysql package
const mysql = require("mysql");

require("dotenv").config();

//console.log(process.env.SECRETPASSWORD)

// Connect to the employees_DB database using a localhost connection
const connection = mysql.createConnection({
  host: "localhost",

  // Your port, if not 3306
  port: 3306,

  // Your MySQL username
  user: "root",

  // Your MySQL password (leave blank for class demonstration purposes; fill in later)
  password: process.env.SECRETPASSWORD,

  // Name of database
  database: "employees_DB",
});

module.exports = connection;
