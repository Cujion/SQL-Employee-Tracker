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
        case 'VIEW ALL EMPLOYEES':
            viewAllEmployees();
            break;
        case 'ADD EMPLOYEE': {
            addEmployee();
            break;
        }
        case 'UPDATE EMPLOYEE ROLES': {
            init();
            break;
        }
        case 'VIEW ALL ROLES':
            viewAllRoles();
            break;
        case 'ADD ROLE': {
            init();
            break;
        }
        case 'VIEW ALL DEPARTMENTS':
            viewAllDepartments();
            break;
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

viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        console.table(employees);
        init();
    });
};

addEmployee = () => {
    db.query('INSERT INTO employee', (err, employees) => {
        prompt({
            name: 'firstName',
            type: 'input',
            message: "What is the new employee's first name?"
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the new employee's last name?"
        },
        {
            name: 'role',
            type: 'rawlist',
            message: "What is the new employee's role?"
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: "Who is the new employee's manager?",
            choices: employees
        })
        init();
    });
};

viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        console.table(departments);
        init();
    });
};

const init = () => {
    console.info (`
    ╔ ╗╔════╔═══╗═════╔╗══════════════════╗╔ ╗
    ║ ║╚════║╔══╝═════║║══════════════════╝║ ║
    ║ ║     ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗     ║ ║
    ║ ║     ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣     ║ ║
    ║ ║     ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣     ║ ║
    ║ ║     ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝     ║ ║
    ║ ║╔════╔═╗╔═╗═║║══════╔═╝║═══════════╗║ ║
    ║ ║╚════║║╚╝║║═╚╝══════╚══╝═══════════╝║ ║
    ║ ║     ║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗        ║ ║
    ║ ║     ║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝        ║ ║
    ║ ║     ║║║║║║╔╗║║║║╔╗║╚╝║║═╣║         ║ ║
    ║ ║     ╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝         ║ ║
    ║ ║╔══════════════════╔═╝║════════════╗║ ║
    ╚ ╝╚══════════════════╚══╝════════════╝╚ ╝`)
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