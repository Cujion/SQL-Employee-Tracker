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
    db.query('SELECT * FROM role', (err, roles) => {
        const possibleRoles = roles.map(role => ({ value: role.title }));
        console.log("possibleRoles", possibleRoles);
        db.query('SELECT * FROM employee', (err, employees) => {
            const possibleManagers = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name }));
            console.log("possibleManager", possibleManagers);
            prompt([
                {
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
                    type: 'list',
                    message: "What is the new employee's role?",
                    choices: possibleRoles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who is the new employee's manager?",
                    choices: possibleManagers
                }
            ]).then()
        });
    })
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
    console.info(`
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