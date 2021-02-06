// Dependencies
const connection = require("./connection");
const cTable = require("console.table");
const inquirer = require("inquirer");
let figlet = require("figlet");

// figlet('Welcome!', function(err, data) {
//   if (err) {
//       console.log('Something went wrong...');
//       console.dir(err);
//       return;
//   }
//   console.log(data)
// });

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
        choices: ["Add", "View", "Update", "Delete", "Done"],
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
        default:
        done(); //create a done function! should say goodbye...
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
        type: "list",
        message: "What would you like to add?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"],
      },
    ])
    .then((response) => {
      switch (response.adding) {
        case "Department":
          return addDepartment();
        case "Role":
          return addRole();
        case "Employee":
          return addEmployee();
        default:
          mainMenu();
      }
    });
};
//Viewing Information:
const viewWhat = () => {
  inquirer
    .prompt([
      {
        name: "viewing",
        type: "list",
        message: "What would you like to view?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"], //Repetitive...fix!
      },
    ])
    .then((response) => {
      switch (response.viewing) {
        case "Department":
          return viewDepartment();//Do I want to create this function OR make it a subcategory then call the getAll functions?
        case "Role":
          return getAllRoles();
        case "Employee":
          return viewEmployee();
        default:
          mainMenu();
      }
    });
};

//Updating Information:
const updateWhat = () => {
  inquirer
    .prompt([
      {
        name: "updating",
        type: "list",
        message: "What would you like to update?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"], //Repetitive again...
      },
    ])
    .then((response) => {
      switch (response.updating) {
        case "Department":
          return updateDepartment();
        case "Role":
          return updateRole();
        case "Employee":
          return updateEmployee();
        default:
          mainMenu(); 
      }
    });
};

//Deleting Information:
const deleteWhat = () => {
  inquirer
    .prompt([
      {
        name: "deleting",
        type: "list",
        message: "What would you like to delete?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"], //Repetitive again...
      },
    ])
    .then((response) => {
      switch (response.deleting) {
        case "Department":
          return deleteDepartment();
        case "Role":
          return deleteRole();
        case "Employee":
          return deleteEmployee();
        default:
          mainMenu(); 
      }
    });
};

generalOptions();

//Main menu function:
mainMenu = () => {
  return generalOptions();
};









// done = () => {
//   figlet('Goodbye!', function(err, data) {
//   if (err) {
//       console.log('Something went wrong...');
//       console.dir(err);
//       return;
//   }
//   console.log(data)
// });
// }