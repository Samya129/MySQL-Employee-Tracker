USE employees_DB;

INSERT INTO department(name) 
VALUES ("HR"),("Sales"),("Payroll");

INSERT INTO role (title, salary, department_id) 
VALUES ("Salesperson", 40000, 1), ("Representative", 35000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("John","Smith",1, 1), ("Samantha", "Jones",2 , null);
