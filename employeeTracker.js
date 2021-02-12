// Dependencies
const connection = require("./connection");
const cTable = require("console.table");
const inquirer = require("inquirer");
let figlet = require("figlet");

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
          return updateEmployee();
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
    ])
    .then((response) => {
      switch (response.yesOrNo) {
        case "Yes, Exit Please!":
          return done();
        case "No, go back to the Main menu.":
          return mainMenu();
      }
    });
};

//Validation:
async function confirmUserText(userTxt) {
  if (userTxt.trim() != "" && userTxt.trim().length <= 30) {
    return true;
  }
  return "Invalid entry. Please limit your entry to 30 characters or less.";
}

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
    ])
    .then((response) => {
      connection.query("INSERT INTO department (name) VALUES (?)", [
        response.departmentAdd,
      ]);
      console.log(
        `${response.departmentAdd} was added to the list of departments.`
      );
      mainMenu();
    });
};

addRole = async () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    //console.table(res);
    var namesOfRoles = res;
    var collOfRoles = namesOfRoles.map((nameOfRole) => {
      return nameOfRole.name;
    });
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
          message: "What department does this person's job work in?",
          choices: collOfRoles,
        },
      ])
      .then((response) => {
        connection.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${response.roleTitle}","${response.roleSalary}", (SELECT id FROM department WHERE name = "${response.roleDepartment}"))`
        );

        console.log(
          `Role: ${response.roleTitle}, Salary: ${response.roleSalary}, Department: ${response.roleDepartment} was added to the list of role titles.`
        );
        mainMenu();
      });
  });
};

addEmployee = async () => {
  connection.query(`SELECT title FROM role`, function (err, res) {
    if (err) throw err;
    var roles = res;
    var collOfRoles = roles.map((role) => {
      return role.title;
    });

    const employeeQuery = () => {
      let arr = ["None"];
      connection.query(
        'SELECT CONCAT(first_name, " ", last_name) as name FROM employee',
        (err, res) => {
          if (err) throw err;
          res.map((employee) => arr.push(employee.name));
        }
      );
      return arr;
    };

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message:
            "What is the first name of this employee you would like to add?",
        },
        {
          name: "lastName",
          type: "input",
          message:
            "What is the last name of this employee you would like to add?",
        },
        {
          name: "addRole",
          type: "list",
          message: "What is your role?",
          choices: collOfRoles,
          //[array of roles]
        },
        {
          name: "addManager",
          type: "list",
          message: "Who is your manager? If not applicable, choose None",
          choices: employeeQuery(),
        },
      ])
      .then(async (response) => {
        const firstName = response.firstName;
        const lastName = response.lastName;

        connection.query(
          "SELECT id FROM role WHERE title = ?",
          [response.addRole],
          (err, role) => {
            if (err) throw err;
            connection.query(
              "SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?",
              [response.addManager],
              (err, manager) => {
                if (err) throw err;
                connection.query(
                  "INSERT INTO employee SET ?",
                  {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: role[0].id,
                    manager_id: manager[0].id,
                  },
                  function (err, results) {
                    if (err) throw err;
                    console.log(
                      "Your employee was created successfully:"
                    );
                    mainMenu();
                  }
                );
              }
            );
          }
        );
      });
  });
};

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
  connection.query(
    "SELECT * FROM department AS Department",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      yesOrNo();
    }
  );
}
async function viewAllRoles() {
  connection.query(
    "SELECT role.id AS Id, title AS Title, salary AS Salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      yesOrNo();
    }
  );
}
async function viewAllEmployees() {
  connection.query(
    `SELECT e.id AS Id, CONCAT(e.first_name, " ", e.last_name) AS Employee, role.title AS Title, department.name AS Department, salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager
FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department ON role.department_id=department.id LEFT JOIN employee m ON m.id=e.manager_id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      yesOrNo();
    }
  );
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
          return viewAllDepartments();
        case "Roles":
          return viewAllRoles();
        case "Employees":
          return viewAllEmployees();
        default:
          mainMenu();
      }
    });
};

//Updating Employee Function:
async function AllEmployees() {
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT * FROM employee`, function (err, res) {
      if (err) reject(err);
      var Employees = res.map((employee) => {
        //console.log(employee)
        return employee.first_name;
      });
      resolve(Employees);
    });
  });
}
updateEmployee = async () => {
  connection.query("SELECT * from role", async function (err, res) {
    if (err) throw err;
    var roleResult = res; //all role results in the list defined
    var roleOfNames = roleResult.map((updateRole) => {
      //mapping out to get the information you ACTUALLY want.
      return updateRole.title;
    });
    var employees = await AllEmployees();
    inquirer
      .prompt([
        {
          name: "updateEmployee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employees,
        },
        {
          name: "newRole",
          type: "list",
          message: "What is the new role for this person?",
          choices: roleOfNames,
        },
      ])
      .then((response) => {
        //Pick the employee you would like to update, pick the new role they have THEN updating employee information.
        connection.query(
          `SELECT * FROM role WHERE title = '${response.newRole}'`,
          function (err, role) {
            connection.query(
              `SELECT * FROM employee WHERE first_name = '${response.updateEmployee}'`,
              function (err, user) {
                connection.query(
                  `UPDATE employee SET role_id = ? WHERE id = ?`,
                  [role[0].id, user[0].id],
                  function (err, res) {
                    console.log(`Updated User: ${response.updateEmployee}`);
                    viewAllEmployees();
                  }
                );
              }
            );
          }
        );
      });
  });
};

//Deleting Question:
const deleteWhat = async () => {
  inquirer
    .prompt([
      {
        name: "deleting",
        type: "list",
        message: "What would you like to delete?",
        choices: ["Department", "Role", "Return to Main Menu"],
      },
    ])
    .then((response) => {
      switch (response.deleting) {
        case "Department":
          return deleteDepartment();
        case "Role":
          return deleteRole();
        default:
          mainMenu();
      }
    });
};

//Deleting Functions
const deleteDepartment = async () => {
  connection.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    const listOfDepartments = res;
    // console.table(res)
    const departmentSelected = listOfDepartments.map((department) => {
      return department.name;
    });
    inquirer
      .prompt([
        {
          name: "deletedDepartment",
          type: "list",
          message: "Which department would you like to delete?",
          choices: departmentSelected,
        },
      ])
      .then((response) => {
        connection.query(`DELETE FROM department WHERE (name) = ?`, [
          response.deletedDepartment,
        ]);
        console.log(`${response.deletedDepartment} was deleted from departments.`);
        yesOrNo();
      });
  });
};
const deleteRole = async () => {
  connection.query(
    "SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, res) {
      if (err) throw err;
      const rolesList = res;
      const roleOfNames = rolesList.map((role) => {
        return role.title;
      });
      inquirer
        .prompt([
          {
            name: "roleToDelete",
            type: "list",
            message: "Which role would you like to delete?",
            choices: roleOfNames,
          },
        ])
        .then((answers) => {
          connection.query("DELETE FROM role WHERE (title) = ?", [
            answers.roleToDelete,
          ]);
          console.log(`${answers.roleToDelete} was deleted from roles.`);
          yesOrNo();
        });
    }
  );
};

generalOptions();

//Exit Function:
done = async () => {
  figlet("Goodbye!", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    connection.end(); //close the connection
  });
};