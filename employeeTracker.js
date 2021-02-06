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
});

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
        done(); 
      }
      //console.log(answer.userChoice)
    });
};

//Main menu function:
mainMenu = () => {
  return generalOptions();
};

yesOrNo = () => {
  inquirer
      .prompt([
        {
          name: "yesOrNo",
          type: "list",
          message: "Are you done completely?",
          choices: ["Yes, Exit Please!", "No, go back to the Main menu."],
        },
      ]).then((response) => {
      switch (response.yesOrNo) {
        case "Yes, Exit Please!":
          return done();
        case "No, go back to the Main menu.":
        return mainMenu();
      }
      })
    };

//Validation:
function confirmUserText(userTxt) {
  if ((userTxt.trim() != "") && (userTxt.trim().length <= 30)) {
      return true;
  }
  return "Invalid entry. Please limit your entry to 30 characters or less."
};

//Adding Functions
addDepartment = () => {
  inquirer
  .prompt([
    {
      name: "departmentAdd",
      type: "input",
      message: "What department would you like to create?",
      validate: confirmUserText,
    },
  ]).then((response)=>{
   connection.query("INSERT INTO department (name) VALUES (?)", [response.departmentAdd]);
   console.log(`${response.departmentAdd} was added to the list of departments.`);
   mainMenu();
  })
  };

  // addRole = () => {
  //   inquirer
  //   .prompt([
  //     {
  //       name: "roleAdd",
  //       type: "input",
  //       message: "What role would you like to create?",
  //       validate: confirmUserText,
  //     },
  //   ]).then((response)=>{
  //    connection.query("INSERT INTO role (title, salary, department_id ) VALUES (?)", [response.roleAdd]);
  //    console.log(`${response.roleAdd} was added to the list of roles.`);
  //    mainMenu();
  //   })
  //   };

  addEmployee = () => {
    inquirer
    .prompt([
      {
        name: "employAddTitle",
        type: "input",
        message: "What is the type of job title you would like to add?",
      },
      {
        name: "employAddSalary",
        type: "input",
        message: "How much does this given job title make a year?",
      },
      {
        name: "employAddId",
        type: "input",
        message: "What is the department id for this job title?",
      },
    ]).then((response)=>{
     connection.query("INSERT INTO role (title, salary, department_id ) VALUES (?)", [response.employAddTitle, response.employAddSalary, response.employAddId]);
     console.log(`${response.roleAdd} was added to the list of roles.`);
     mainMenu();
    })
    };




//Adding Questions:
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

//Viewing Functions

function viewAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res); 
    yesOrNo();
  })
}
function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
    yesOrNo();
  });
}
function viewAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    yesOrNo();
  });
}

//Viewing Questions:
const viewWhat = () => {
  inquirer
    .prompt([
      {
        name: "viewing",
        type: "list",
        message: "What would you like to view?",
        choices: ["Departments", "Roles", "Employees", "Return to Main Menu"],
      },
    ])
    .then((response) => {
      switch (response.viewing) {
        case "Departments":
          return  viewAllDepartments();
        case "Roles":
          return viewAllRoles(); 
        case "Employees":
          return viewAllEmployees();  
        default:
          mainMenu();
      }
    });
};

//Updating Questions:
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
//Deleting Functions
// function deleteDepartment(){}
function deleteRole() {
  inquirer.prompt([
      {
          name: "depName",
          type: "list",
          message: "Which department would you like to delete?",
          choices: [],
      }
  ]).then(response => {
      
      mainMenu();
  })
  };
// function deleteEmployee(){}

//Deleting Questions:
const deleteWhat = () => {
  inquirer
    .prompt([
      {
        name: "deleting",
        type: "list",
        message: "What would you like to delete?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"],
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


updateRole = () => {
  connection.query("SELECT * FROM role", function (err, res){
    if (err) throw err;
    var roleResult = res; //all role results in the list defined
    var roleOfNames = roleResult.map((newRole)=> { //mapping out to get the information you ACTUALLY want.
    return newRole.title;  
    }) 
  inquirer
  .prompt([
    {
      name: "updateRole",
      type: "list",
      message: "Which role would you like to update?",
      choices: roleOfNames
    },
  ]).then((response)=>{
    console.log(response);
  })

  })
}



done = () => {
  figlet('Goodbye!', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
  connection.end(); //close the connection
});
}