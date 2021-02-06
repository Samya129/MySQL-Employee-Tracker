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
 
function getAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res); 
  })
}

yesOrNo = () => {
inquirer
    .prompt([
      {
        name: "yesOrNo",
        type: "checkbox",
        message: "Are you done?",
        choices: ["Yes", "No", "Return to Main Menu"],
      },
    ]).then((response) => {
    switch (response.yesOrNo) {
      case "Yes":
        return addDepartment();
      case "No":
        return 
      default:
        mainMenu();
    }

  }
}



function getAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function getAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

// getAllDepartments();
// getAllRoles();
// getAllEmployees();

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
          return  getAllDepartments(); //viewDepartment();
        case "Role":
          return getAllRoles(); //viewRoles();
        case "Employee":
          return getAllEmployees(); //viewEmployee(); 
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

function confirmUserText(userTxt) {
  if ((userTxt.trim() != "") && (userTxt.trim().length <= 30)) {
      return true;
  }
  return "Invalid entry. Please limit your entry to 30 characters or less."
};

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



//   function removeDepartment() {
//     let departments = await db.query('SELECT id, name FROM department');
//     departments.push({ id: null, name: "Cancel" });
//     inquirer.prompt([
//         {
//             name: "depName",
//             type: "list",
//             message: "Remove which department?",
//             choices: departments.map(obj => obj.name)
//         }
//     ]).then(response => {
//         if (response.depName != "Cancel") {
//             let uselessDepartment = departments.find(obj => obj.name === response.depName);
//             db.query("DELETE FROM department WHERE id=?", uselessDepartment.id);
//             console.log("\x1b[32m", `${response.depName} was removed. Please reassign associated roles.`);
//         }
//         runApp();
//     })
// };





// done = () => {
//   figlet('Goodbye!', function(err, data) {
//   if (err) {
//       console.log('Something went wrong...');
//       console.dir(err);
//       return;
//   }
//   console.log(data)
//   connection.end(); //close the connection
// });
// }