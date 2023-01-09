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
            viewAllDepartments();
            break;
        case 'ADD EMPLOYEE': {
            init();
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

viewAllDepartments = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        console.table(employees);
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