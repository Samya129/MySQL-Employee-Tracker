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

//Testing the connection
connection.connect((err) => {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
});

//General Questions:
const generalOptions = async () => {
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
mainMenu = async () => {
  return generalOptions();
};

yesOrNo = async () => {
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
async function confirmUserText(userTxt) {
  if ((userTxt.trim() != "") && (userTxt.trim().length <= 30)) {
      return true;
  }
  return "Invalid entry. Please limit your entry to 30 characters or less."
};

//Adding Functions
addDepartment = async () => {
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

  addRole = async () => {
    inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What role would you like to create?",
        validate: confirmUserText,
      },
      {
        name: "roleSalary",
        type: "input",
        message: "How much does this person make a year?",
        validate: confirmUserText,
      },
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
    message: "What is the role id for this job title?",
  },
  {
    name: "employAddManagerId",
    type: "input",
    message: "What is the manager id for this job title?",
  },
    ]).then((response)=>{
     connection.query("INSERT INTO role (title, salary) VALUES (?)", [response.roleTitle, response.roleSalary]);
     console.log(`${response.roleTitle} was added to the list of role titles`+ `and` + `${response.roleSalary} was added to their salary.`);
     mainMenu();
    })
    };

  addEmployee = async () => {
    inquirer
    .prompt([
      {
        name: "employAddFirst",
        type: "input",
        message: "What is the first name of this employee?",
      },
      {
        name: "employAddLast",
        type: "input",
        message: "What is the last name of this employee?",
      },
      {
        name: "employAddId",
        type: "input",
        message: "What is the role id for this job title?", //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql.
      },
      {
        name: "employAddManagerId",
        type: "input",
        message: "What is the manager id for this job title?", //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql
      },
    ])
    .then((response)=>{
     connection.query("INSERT INTO employee SET ?",
     {
       first_name: response.employAddFirst,
       last_name: response.employAddLast,
       role_id: response.employAddId,
       manager_id: response.employAddManagerId
     },
     function(err) {
      if (err) throw err;
      console.log("Your employee was created successfully!");
      mainMenu();
    }
  )
  });
  }


//Adding Questions:
const addWhat = async () => {
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
async function viewAllDepartments() {
  connection.query("SELECT * from department", function (err, res) {
    if (err) throw err;
    console.table(res); 
    yesOrNo();
  })
}
async function viewAllRoles() {
  connection.query("SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id", function (err, res) {
    if (err) throw err;
    console.table(res)
    yesOrNo(); 
  });
}
async function viewAllEmployees() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
    yesOrNo();
  });
}

//Viewing Questions:
const viewWhat = async () => {
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
const updateWhat = async () => {
  inquirer
    .prompt([
      {
        name: "updating",
        type: "list",
        message: "What would you like to update?",
        choices: ["Department", "Role", "Employee", "Return to Main Menu"],
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
async function deleteRole() {
  
console.log(viewAllRoles())
  var choices = viewAllRoles().then (res => res )
  console.log(choices) 
  inquirer.prompt([
      {
          name: "roleDelete",
          type: "rawlist",
          message: "Which department would you like to delete?",
          choices: choices //display allroles as choices
      }
   ])
  .then(response => {
    var roleToDelete = response.name
  //console.log(roleToDelete);
  roles = roles.filter((role) => role != roleToDelete);
  mainMenu();
  return roles
      //then filter through it and append everything BUT what was NOT deleted.
      
  })
  };
// function deleteEmployee(){}





//Deleting Questions:
const deleteWhat = async () => {
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


updateRole = async () => {
  connection.query("SELECT * from role", function (err, res){
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
    //Pick the employee you would like to update, pick the new role they have THEN updating employee information.
    console.table(response);
  })

  })
}















done = async () => {
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