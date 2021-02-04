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
    //console.table(res);
  });
}

function getAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    //console.table(res);
  });
}

function getAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    //console.table(res);
  });
}

getAllDepartments();
getAllRoles();
getAllEmployees();

const generalOptions = () => {
inquirer
  .prompt([
    {
      name: "userChoice",
      type: "list",
      message: "Please select an option of what you would you like to do?",
      choices: ["Add","View","Update", "Delete"],
    },
])
.then((answer) => {
switch (answer.userChoice){
  case "Add":
  return addWhat();
  case "View":
  return viewWhat();
  case "Update":
  return updateWhat();
  case "Delete":
    return deleteWhat();
}
//console.log(answer.userChoice)
});
};
generalOptions();