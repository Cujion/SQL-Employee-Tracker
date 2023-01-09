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
        case 'UPDATE EMPLOYEE ROLE':
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
};

viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        console.table(employees);
        init();
    });
};

addEmployee = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        const possibleRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('possibleRoles', possibleRoles);
        db.query('SELECT * FROM employee', (err, employees) => {
            const possibleManagers = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name }));
            console.log('possibleManager', possibleManagers);
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
    db.query('SELECT * FROM role', (err, roles) => {
        const grabRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('AllRoles', grabRoles);
        db.query('SELECT * FROM employee', (err, employees) => {
            const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.role_id }));
            console.log('AllEmployees', grabEmployees);
            prompt([
                {
                    name: 'employeeNames',
                    type: 'list',
                    message: "Which employee's role would you like to update?",
                    choices: grabEmployees
                },
                {
                    name: 'updateRole',
                    type: 'list',
                    message: 'What role should the employee be updated to?',
                    choices: grabRoles
                }
            ]).then()
        });
    })
};

updateEmployeeManager = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.manager_id }));
        console.log('AllEmployees', grabEmployees);
        prompt([
            {
                name: 'employee',
                type: 'list',
                message: "Which employee would you like to update their manager?",
                choices: grabEmployees
            },
            {
                name: 'updatedManager',
                type: 'list',
                message: "Who is the new manager for the selected employee?",
                choices: grabEmployees
            }
        ]).then()
    })
};

deleteEmployee = () => {

};

viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

addRole = () => {

};

deleteRole = () => {

};

viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        console.table(departments);
        init();
    });
};

addDepartment = () => {
    prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'Enter the name of the new department you would like to add.'
        }
    ])
};

deleteDepartment = () => {

};

viewDepartmentBudget = () => {

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
};

quit = () => {

};

init();