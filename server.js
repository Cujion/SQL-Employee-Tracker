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
    db.query('SELECT * FROM employee', (err, employees) => {
        const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.manager_id }));
        console.log('AllEmployees', grabEmployees);
        prompt([
            {
                name: 'employee',
                type: 'list',
                message: "Which employee would you like to delete from database?",
                choices: grabEmployees
            }
        ]).then()
    })
};

viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

addRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        const grabRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('AllRoles', grabRoles);
        prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the role you are adding?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role you are adding?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department would you like to add this role too?',
                choices: grabRoles
            }
        ]).then()
    });
};

deleteRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        const grabRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('AllRoles', grabRoles);
        prompt([
            {
                name: 'roles',
                type: 'list',
                message: "Which role would you like to delete from database?",
                choices: grabRoles
            }
        ]).then()
    })
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
    ]).then()
};

deleteDepartment = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        const grabDepartments = departments.map(department => ({ name: department.name }));
        console.log('AllDepartments', grabDepartments);
        prompt([
            {
                name: 'departments',
                type: 'list',
                message: "Which department would you like to delete from database?",
                choices: grabDepartments
            }
        ]).then()
    })
};

viewDepartmentBudget = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        const grabDepartments = departments.map(department => ({ name: department.name }));
        console.log('AllDepartments', grabDepartments);
        prompt([
            {
                name: 'departments',
                type: 'list',
                message: "Which department would you like to see the total utilized budget of?",
                choices: grabDepartments
            }
        ]).then()
    })
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
    prompt({
        name: 'quit',
        type: 'confirm',
        message: 'Are you finished editing database?',
        default: true
    }).then((answer) => {
        if (answer.quit === false) return init();
        else {
            db.end();
        }
    })
};

init();