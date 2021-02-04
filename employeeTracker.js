// Dependencies
const connection = require("./connectionPass");
const cTable = require("console.table");
const inquirer = require("inquirer");

connection.connect((err) => {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
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

//General Questions:
const generalOptions = () => {
  inquirer
    .prompt([
      {
        name: "userChoice",
        type: "list",
        message: "Please select an option of what you would you like to do?",
        choices: ["Add", "View", "Update", "Delete"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
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


//Adding Information:
const addWhat = () => {
  inquirer
    .prompt([
      {
        name: "adding",
        type: "checkbox",
        message: "What would you like to add?",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return addDepartment();
        case "Role":
          return addRole();
        case "Employee":
          return addEmployee();
      }
    });
};
//Viewing Information:
const viewWhat = () => {
  inquirer
    .prompt([
      {
        name: "viewing",
        type: "checkbox",
        message: "What would you like to view?",
        choices: ["Department", "Role", "Employee"], //Repetitive...fix!
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return viewDepartment();//Do I want to create this function OR make it a subcategory then call the getAll functions?
        case "Role":
          return getAllRoles();
        case "Employee":
          return viewEmployee();
      }
    });
};

//Updating Information:
const updateWhat = () => {
  inquirer
    .prompt([
      {
        name: "updating",
        type: "checkbox",
        message: "What would you like to update?",
        choices: ["Department", "Role", "Employee"], //Repetitive again...
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return updateDepartment();
        case "Role":
          return updateRole();
        case "Employee":
          return updateEmployee();
      }
    });
};
generalOptions();