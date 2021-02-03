//Dependencies
const connection = require("./connection")
const cTable = require('console.table');
const inquirer = require('inquirer');

connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  connection.end();//close the connection
});

