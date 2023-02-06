const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'employee_tracker'
  },
  console.log(`Connected to the employee_tracker database.`)
);

function init() {
  inquirer.prompt(
    [{type: `list`,
    name: `options`,
    message: `What would you like to do?`,
    choices: [`View all departments`, `View all roles`, `View all employees`, `Add a department`, `Add a role`, `Add an employee`, `Update employee role`, `Quit`]}],)
    .then((answers) => {
      switch(answers.options){
        case `View all departments`:
          db.query(
            `SELECT id AS ID, name AS NAME FROM department;`,
            function(err, results) {
              console.table(results);
              init();
              return;
            }
          );
          break;
        case `View all roles`:
          db.query(
            `SELECT role.id AS ID, role.title AS TITLE, role.salary AS SALARY, department.name AS DEPARTMENT FROM role LEFT JOIN department ON role.department_id = department.id;`,
            function(err, results) {
              console.table(results);
              init();
              return;
            }
          );
          break;
        case `View all employees`:
          db.query(
            `SELECT e.id AS ID, e.first_name AS FIRST_NAME, e.last_name AS LAST_NAME, role.title AS TITLE, m.first_name AS MANAGER_NAME 
            FROM employee AS e
            JOIN employee AS m
            ON e.manager_id = m.id
            LEFT JOIN role
            ON e.role_id = role.id;`,
            function(err, results) {
              console.table(results);
              init();
              return;
            }
          );
          break;
        case `Add a department`:
          addDepartment();
          break;
        case `Add a role`:
          addRole();
          break;
        case `Add an employee`:
          addEmployee();
          break;
        case `Update employee role`:
          updateEmployeeRole();
          break;
        case `Quit`:
          return;
      };
    });
}

init();

function addDepartment(){
  inquirer.prompt(
    [{type: `input`,
    name: `add_department`,
    message: `What is the name of the department that you want to add?`}],)
    .then((answers) => {
      db.query(
        `INSERT INTO department (name) VALUES ("${answers.add_department}");`,
        function(err, results) {
          console.log(`${answers.add_department} added successfully into departments.\n`);
          init();
          return;
        }
      )
    }
  )
};

function addRole(){
  db.query(`SELECT name FROM department;`, function(err, results){
    let dataArray = results.map(obj => obj.name);
    inquirer.prompt(
      [{
        type: `input`,
        name: `add_role`,
        message: `What is the name of the role that you want to add?`
      },
      {
        type: `input`,
        name: `add_role_salary`,
        message: `What is the salary for the role?`
      },
      {
        type: `list`,
        name: `add_role_deptid`,
        message: `What department does the role fall under?`,
        choices: dataArray
      }],)
      .then((answers) => {
        db.query(`SELECT id FROM department WHERE name = "${answers.add_role_deptid}";`, function(err, results){
          let roleID = parseInt(results.map(obj => obj.id));
          db.query(
            `INSERT INTO role (title, salary, department_id) VALUES ("${answers.add_role}", ${answers.add_role_salary}, ${roleID});`,
            function(err, results) {
              console.log(`${answers.add_role} added successfully into roles.\n`);
              init();
              return;
            }
          )
        })
      }
    )
  });
};

function addEmployee(){
  db.query(`SELECT title FROM role;`, function(err, results){
    let roleDataArray = results.map(obj => obj.title);
    db.query(`SELECT first_name FROM employee;`, function(err, results){
      let empDataArray = results.map(obj => obj.first_name);
      inquirer.prompt(
        [{
          type: `input`,
          name: `add_employee_first`,
          message: `What is the first name of the employee?`
        },
        {
          type: `input`,
          name: `add_employee_last`,
          message: `What is the last name of the employee?`
        },
        {
          type: `list`,
          name: `add_employee_roleid`,
          message: `What role should be assigned to the employee?`,
          choices: roleDataArray
        },
        {
          type: `list`,
          name: `add_employee_mgrid`,
          message: `Who is the employee's manager?`,
          choices: empDataArray
        }],)
        .then((answers) => {
          db.query(`SELECT id FROM role WHERE title = "${answers.add_employee_roleid}"`, function(err, results){
            let roleID = parseInt(results.map(obj => obj.id));
            db.query(`SELECT id FROM employee WHERE first_name = "${answers.add_employee_mgrid}"`, function(err, results){
              let mgrID = parseInt(results.map(obj => obj.id));
              db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.add_employee_first}", "${answers.add_employee_last}"", ${roleID}, ${mgrID});`,
                function(err, results) {
                  console.log(`${answers.add_employee_first} ${answers.add_employee_last} added successfully into employees.\n`);
                  init();
                  return;
                }
              )
            })
          })
        }
      )
    })
  });
};

function updateEmployeeRole(){
  db.query(`SELECT title FROM role;`, function(err, results){
    let roleDataArray = results.map(obj => obj.title);
    db.query(`SELECT first_name FROM employee;`, function(err, results){
      let empDataArray = results.map(obj => obj.first_name);
      inquirer.prompt(
        [{
          type: `list`,
          name: `update_employee_id`,
          message: `Select the employee to update the role?`,
          choices: empDataArray
        },
        {
          type: `list`,
          name: `update_employee_roleid`,
          message: `Select the new role for the employee?`,
          choices: roleDataArray
        }],)
        .then((answers) => {
          db.query(`SELECT id FROM role WHERE title = "${answers.update_employee_roleid}"`, function(err, results){
            let roleID = parseInt(results.map(obj => obj.id));
            db.query(`SELECT id FROM employee WHERE first_name = "${answers.update_employee_id}"`, function(err, results){
              let mgrID = parseInt(results.map(obj => obj.id));
              db.query(
                `UPDATE employee SET role_id=${roleID} WHERE id=${mgrID};`,
                function(err, results) {
                  console.log(`${answers.update_employee_id} is now a ${answers.update_employee_roleid}.\n`);
                  init();
                  return;
                }
              )
            })
          })
        }
      )
    })
  });
};

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});