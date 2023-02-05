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

const questions = [
  {
    type: `list`,
    name: `options`,
    message: `What would you like to do?`,
    choices: [`View all departments`, `View all roles`, `View all employees`, `View employees by manager`, `View employees by department`,`Add a department`, `Add a role`, `Add an employee`, `Update employee role`, `Quit`],
  },
  {
    type: `input`,
    name: `add_department`,
    message: `What is the name of the department that you want to add?`,
    when: (answers) => answers.options === `Add a department`
  },
  {
    type: `input`,
    name: `add_role`,
    message: `What is the name of the role that you want to add?`,
    when: (answers) => answers.options === `Add a role`
  },
  {
    type: `input`,
    name: `add_role_salary`,
    message: `What is the salary for the role?`,
    when: (answers) => answers.options === `Add a role`
  },
  {
    type: `input`,
    name: `add_role_deptid`,
    message: `What is the department ID that the role falls under?`,
    when: (answers) => answers.options === `Add a role`
  },
  {
    type: `input`,
    name: `add_employee_first`,
    message: `What is the first name of the employee?`,
    when: (answers) => answers.options === `Add an employee`
  },
  {
    type: `input`,
    name: `add_employee_last`,
    message: `What is the last name of the employee?`,
    when: (answers) => answers.options === `Add an employee`
  },  {
    type: `input`,
    name: `add_employee_roleid`,
    message: `What is the role ID for the employee?`,
    when: (answers) => answers.options === `Add an employee`
  },
  {
    type: `input`,
    name: `add_employee_mgrid`,
    message: `What is the manager's ID for the employee?`,
    when: (answers) => answers.options === `Add an employee`
  },
  {
    type: `input`,
    name: `update_employee_id`,
    message: `What's the ID of employee to be updated?`,
    when: (answers) => answers.options === `Update employee role`
  },
  {
    type: `input`,
    name: `update_employee_roleid`,
    message: `What's the ID of the new role to be assigned to the employee?`,
    when: (answers) => answers.options === `Update employee role`
  }];

  function init() {
    inquirer.prompt(
      [{type: `list`,
      name: `options`,
      message: `What would you like to do?`,
      choices: [`View all departments`, `View all roles`, `View all employees`, `View employees by manager`, `View employees by department`,`Add a department`, `Add a role`, `Add an employee`, `Update employee role`, `Quit`]}],)
      .then((answers) => {
        switch(answers.options){
          case `View all departments`:
            db.query(
              `SELECT * FROM department`,
              function(err, results) {
                console.table(results);
                init();
                return;
              }
            );
            break;
          case `View all roles`:
            db.query(
              `SELECT * FROM role`,
              function(err, results) {
                console.table(results);
                init();
                return;
              }
            );
            break;
          case `View all employees`:
            db.query(
              `SELECT * FROM employee`,
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
            db.query(
              `INSERT INTO employee (title, salary, department_id) VALUES ("${answers.add_role}", ${answers.add_role_salary}, ${answers.add_role_deptid});`,
              function(err, results) {
                console.log(`${answers.add_employee_first} ${answers.add_employee_last} added successfully into employees.`);
                init();
                return;
              }
            );
            break;
          case `Update employee role`:
            db.query(
              `UPDATE employee SET role_id=${answers.update_employee_roleid} WHERE id=${answers.update_employee_id};`,
              function(err, results) {
                console.log(`Role ID for employee ID ${answers.update_employee_id} updated to ${answers.update_employee_roleid}.`);
                init();
                return;
              }
            );
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
          console.log(`${answers.add_department} added successfully into departments.`);
          init();
          return;
        }
      )
    }
  )
};

function addRole(){
  db.query("SELECT name FROM department", function(err, results){
    const dataArray = results.map(obj => obj.name);
    return dataArray;
  })
  .then((data) => {
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
      message: `What is the department ID that the role falls under?`,
      choices: data
    }],)
    .then((answers) => {
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${answers.add_role}", ${answers.add_role_salary}, ${answers.add_role_deptid});`,
    function(err, results) {
      console.log(`${answers.add_role} added successfully into roles.`);
      init();
      return;
        }
      )
    }
  )})
};

// const xyz = db.query(
//     `SELECT name FROM department`,
//     function(err, results) {
//       const dataArray = results.map(obj => obj.name);
//       return dataArray;
//     }
//     );
// console.log(xyz);

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
