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
    password: '',
    database: 'employee_tracker'
  },
  console.log(`Connected to the employee_tracker database.`)
);

db.query(
  'SELECT * FROM employee WHERE manager_id = 2',
  function(err, results) {
  }
);

const questions = [
  {
      type: `list`,
      name: `options`,
      message: `What would you like to do?`,
      choices: [`View all departments`, `View all roles`, `View all employees`, `Add a department`, `Add a role`, `Add an employee`, `Update employee role`, `Quit`],
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
      message: `What is the name of the department that you want to add?`,
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
    name: `update_employee_role1`,
    message: `What's the ID of employee to be updated?`,
    when: (answers) => answers.options === `Update employee role`
  },
  {
    type: `input`,
    name: `update_employee_role2`,
    message: `What's the ID of the new role to be assigned to the employee?`,
    when: (answers) => answers.options === `Update employee role`
  }];

  function init() {
    inquirer.prompt(questions).then((answers) => {
        switch(answers.options){
          case `View all departments`:

            break;
          case `View all roles`:
              
            break;
          case `View all employees`:
            
            break;
          case `Add a department`:
            
            break;
          case `Add a role`:
              
            break;
          case `Add an employee`:
            
            break;
          case `Update employee role`:
            
            break;
          case `Quit`:

            break;
        };
      });
}

init();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
