// Dependencies
const connection = require("./connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.end(); //close the connection
});

function getAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function getAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

getAllDepartments();
getAllRoles();