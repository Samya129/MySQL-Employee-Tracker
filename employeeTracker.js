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

//General Question:
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
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.table(res); 
      var namesOfDepartments = res;
      var collOfDepartments = namesOfDepartments.map((nameOfDepartment)=>{
        return nameOfDepartment.name
      })
    inquirer
    .prompt([
      {
      name: "roleTitle",
      type: "input",
      message: "What role would you like to create?",
    },
    {
      name: "roleSalary",
      type: "input",
      message: "How much does this person make a year?",
    },
    {
      name: "roleDepartment",
      type: "list",
      message: "What department does this role associate with?",
      choices: collOfDepartments,
     
    },
    ]).then((response)=>{
     connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.roleTitle}","${response.roleSalary}", (SELECT id FROM department WHERE name = "${response.roleDepartment}"))`)
     
     console.log(`Role: ${response.roleTitle}, Salary: ${response.roleSalary}, Department: ${response.roleDepartment} was added to the list of role titles.`)
     mainMenu();
  })
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
        type: "list",
        message: "What is your role?",
        choices: "", //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql.
      },
      {
        name: "employAddManagerId",
        type: "list",
        message: "Who is your manager?", //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql
      },
    ])
    .then((response)=>{
      connection.query(`SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IF NULL(r.title, "No Data") AS "Title", IF NULL(department_name, "No Data") AS "Department", IF NULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
      FROM employee e
      LEFT JOIN role r 
      ON r.id = e.role_id 
      LEFT JOIN department d 
      ON d.id = r.department_id
      LEFT JOIN employee m ON m.id = e.manager_id
      WHERE CONCAT(m.first_name," ",m.last_name) = ?
      ORDER BY e.id;`,
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


//Adding Question:
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
  connection.query("SELECT * FROM department AS Department", function (err, res) {
    if (err) throw err;
    console.table(res); 
    yesOrNo();
  })
}
async function viewAllRoles() {
  connection.query("SELECT role.id AS Id, title AS Title, salary AS Salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id", function (err, res) {
    if (err) throw err;
    console.table(res)
    yesOrNo(); 
  });
}
async function viewAllEmployees() {
  connection.query(`SELECT e.id AS Id, CONCAT(e.first_name, " ", e.last_name) AS Employee, role.title AS Title, department.name AS Department, salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager
FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department ON role.department_id=department.id LEFT JOIN employee m ON m.id=e.manager_id`, function (err, res) {
    if (err) throw err;
    console.table(res);
    yesOrNo();
  });
}

//Viewing Question:
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

//Updating Question:
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
  connection.query("SELECT role.id AS Id, title AS Title, salary AS Salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id", function (err, res) {
    if (err) throw err;
    console.table(res); 
    var deleteRoles = res;
    var collOfRoles = deleteRoles.map((deletedRole)=>{
      return deletedRole.title
    })
  inquirer.prompt([
      {
          name: "roleDelete",
          type: "list",
          message: "Which role would you like to delete?",
          choices: collOfRoles 
      }
   ])
  .then(response => {
    connection.query(`DELETE FROM role WHERE role = role.id AS Id, title = title AS Title, salary= salary AS Salary`)

    `DELETE FROM role WHERE title = ${response.deletedRole}")) ? `

    //console.log(`Role: ${response.roleTitle}, Salary: ${response.roleSalary}, Department: ${response.roleDepartment} was added to the list of role titles.`)
    mainMenu();
  })
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
    var roleOfNames = roleResult.map((updateRole)=> { //mapping out to get the information you ACTUALLY want.
    return updateRole.title;  
    }) 
  inquirer
  .prompt([
    {
      name: "updateRole",
      type: "list",
      message: "Which role would you like to update?",
      choices: roleOfNames
    },
    {
      name: "newRole",
      type: "list",
      message: "What is the new role for this person?",
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