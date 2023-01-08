const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db"
});

const initialPrompt = (type) => {
    switch (type) {
        case 'VIEW ALL EMPLOYEES': {
            db.query('SELECT * FROM employee', (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }
        case 'ADD EMPLOYEE': {
            init();
            break;
        }
        case 'UPDATE EMPLOYEE ROLES': {
            init();
            break;
        }
        case 'VIEW ALL ROLES': {
            db.query('SELECT * FROM role', (err, roles) => {
                console.table(roles);
                init();
            });
            break;
        }
        case 'ADD ROLE': {
            init();
            break;
        }
        case 'VIEW ALL DEPARTMENTS': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        }
        case 'ADD DEPARTMENT': {
            init();
            break;
        }
        case 'QUIT': {
            init();
            break;
        }
    }
}

const init = () => {
prompt({
    type: 'rawlist',
    message: 'What would you like to do?',
    choices: [
        'VIEW ALL EMPLOYEES',
        'ADD EMPLOYEE',
        'UPDATE EMPLOYEE ROLE',
        'VIEW ALL ROLES',
        'ADD ROLE',
        'VIEW ALL DEPARTMENTS',
        'ADD DEPARTMENT',
        'QUIT'
    ],
    name: 'type',
})
    .then((answers) => {
        initialPrompt(answers.type);
    });
}

init();