USE employees_DB;

INSERT INTO department(name) 
VALUES ("Finance"),("Human Resources"), ("IT"),("Marketing");

INSERT INTO role (title, salary, department_id) 
VALUES ("Finance Manager", 50000, 1),("IT Manager", 65000,3),("Credit Analyst", 73000, 1), ("Applications Specialist", 66000, 2),("Network Architect", 100000, 3),("Coordinator", 44800, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Ron","Weasley", 1, null), ("Sirius", "Black", 2 , null),("Hermione", "Granger", 3 , 1), ("Neville", "Longbottom", 4 , null)
,("Tom", "Jones", 5 , 2), ("Thomas", "Reed", 6 , null);