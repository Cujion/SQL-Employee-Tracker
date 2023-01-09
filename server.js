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
        case 'ADD EMPLOYEE':
            addEmployee();
            break;
        case 'UPDATE EMPLOYEE ROLES':
            updateEmployeeRole();
            break;
        case 'UPDATE EMPLOYEES MANAGER':
            updateEmployeeManager();
            break;
        case 'VIEW ALL ROLES':
            viewAllRoles();
            break;
        case 'ADD ROLE':
            addRole();
            break;
        case 'VIEW ALL DEPARTMENTS':
            viewAllDepartments();
            break;
        case 'ADD DEPARTMENT':
            addDepartment();
            break;
        case 'DELETE AN EMPLOYEE':
            deleteEmployee();
            break;
        case 'DELETE A ROLE':
            deleteRole();
            break;
        case 'DELETE A DEPARTMENT':
            deleteDepartment();
            break;
        case 'VIEW A DEPARTMENTS TOTAL UTILIZED BUDGET':
            viewDepartmentBudget();
            break;
        case 'QUIT':
            quit();
            break;
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

updateEmployeeRole = () => {

}

updateEmployeeManager = () => {

}

deleteEmployee = () => {

}

viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

addRole = () => {

}

deleteRole = () => {

}

viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        console.table(departments);
        init();
    });
};

addDepartment = () => {

}

deleteDepartment = () => {

}

viewDepartmentBudget = () => {

}

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
            'UPDATE EMPLOYEES MANAGER',
            'VIEW ALL ROLES',
            'ADD ROLE',
            'VIEW ALL DEPARTMENTS',
            'ADD DEPARTMENT',
            'DELETE AN EMPLOYEE',
            'DELETE A ROLE',
            'DELETE A DEPARTMENT',
            'VIEW A DEPARTMENTS TOTAL UTILIZED BUDGET',
            'QUIT'
        ],
        name: 'type',
    })
        .then((answers) => {
            initialPrompt(answers.type);
        });
}

quit = () => {

}

init();