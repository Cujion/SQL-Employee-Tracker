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
        case 'VIEW ALL DEPARTMENTS':
            viewAllDepartments();
            break;
        case 'VIEW ALL EMPLOYEES':
            viewAllEmployees();
            break;
        case 'VIEW ALL ROLES':
            viewAllRoles();
            break;
        case 'ADD DEPARTMENT':
            addDepartment();
            break;
        case 'ADD EMPLOYEE':
            addEmployee();
            break;
        case 'ADD ROLE':
            addRole();
            break;
        case 'UPDATE EMPLOYEE ROLE':
            updateEmployeeRole();
            break;
        case 'UPDATE EMPLOYEES MANAGER':
            updateEmployeeManager();
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

viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error('Error Viewing All Departments');
        console.table(departments);
        init();
    });
};

viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error('Error Viewing All Employees');
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

addDepartment = () => {
    prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'Enter the name of the new department you would like to add.'
        }
    ]).then((answers) => {
        console.table([answers])
        db.query(`INSERT INTO department (name) VALUES ('${answers.addDepartment}');`,
            (err) => {
                if (err) throw console.error(err);
            })
        init();
    })
};

addEmployee = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
        const possibleRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        db.query('SELECT * FROM employee', (employees) => {
            const possibleManagers = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.role_id }));
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
            ]).then((answers) => {
                console.table([answers])
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}','${answers.lastName}',${answers.role},${answers.manager});`,
                    (err) => {
                        if (err) throw console.error(err);
                    })
                init();
            })
        });
    })
};

addRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
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
        ]).then((answers) => {
            console.table([answers])
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${answers.department});`,
                (err) => {
                    if (err) throw console.error(err);
                })
            init();
        })
    });
};

updateEmployeeRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
        const grabRoles = roles.map(role => ({ name: role.title, value: role.id }));
        db.query('SELECT * FROM employee', (employees) => {
            const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
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
            ]).then((answers) => {
                db.query(`UPDATE employee SET role_id=${answers.updateRole} WHERE employee.id=${answers.employeeNames}`, (err, res) => {
                    console.table(res)
                    if (err) {
                        throw console.error(err)
                    }
                })
                init();
            })
        });
    })
};

viewEmployeesByManager = () => {
    db.query('SELECT ')
}

// NEED CHECK IF NULL BONUS
updateEmployeeManager = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error('Error Updating Employee Manager');
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
        ]).then((answers) => {
            console.table([answers.employee])
            console.table([answers.updatedManager])
            db.query(`UPDATE employee SET manager_id=${answers.updatedManager} WHERE employee.id=${answers.employee}`, (err, res) => {
                console.table(res)
                if (err) {
                    throw console.error(err)
                }
            })
            init();
        })
    })
};
// NEEDS WORKS BONUS
deleteEmployee = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error(err);
        const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name }));
        console.log('AllEmployees', grabEmployees);
        prompt([
            {
                name: 'employee',
                type: 'list',
                message: "Which employee would you like to delete from database?",
                choices: grabEmployees
            }
        ]).then((answers) => {
            console.table([answers])
            db.query(`DELETE FROM employee WHERE employee CONCAT(first_name, ' ', last_name) = ${answers.employee}`, (err, res) => {
                console.table(res)
                if (err) {
                    throw console.error(err)
                }
            })
            init();
        })
    })
};

// NEEDS WORK BONUS
deleteRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
        const grabRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('AllRoles', grabRoles);
        prompt([
            {
                name: 'roles',
                type: 'list',
                message: "Which role would you like to delete from database?",
                choices: grabRoles
            }
        ]).then((answers) => {
            console.table([answers])
            db.query('INSERT INTO role', {

            })
        })
        init();
    })
};

// NEEDS WORK BONUS
deleteDepartment = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error(err);
        const grabDepartments = departments.map(department => ({ name: department.name }));
        console.log('AllDepartments', grabDepartments);
        prompt([
            {
                name: 'departments',
                type: 'list',
                message: "Which department would you like to delete from database?",
                choices: grabDepartments
            }
        ]).then((answers) => {
            console.table([answers])
            db.query('INSERT INTO department', {

            })
        })
        init();
    })
};
// NEEDS WORK BONUS
viewDepartmentBudget = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error(err);
        const grabDepartments = departments.map(department => ({ name: department.name }));
        console.log('AllDepartments', grabDepartments);
        prompt([
            {
                name: 'departments',
                type: 'list',
                message: "Which department would you like to see the total utilized budget of?",
                choices: grabDepartments
            }
        ]).then((answers) => {
            console.table([answers])
            db.query('INSERT INTO department', {

            })
        })
        init();
    })
};

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'VIEW ALL DEPARTMENTS', //DONE
            'VIEW ALL EMPLOYEES', //DONE
            'VIEW ALL ROLES', //DONE
            // 'VIEW EMPLOYEES BY DEPARTMENT', //BONUS
            // 'VIEW EMPLOYEES BY MANAGER', //BONUS
            // 'VIEW A DEPARTMENTS TOTAL UTILIZED BUDGET', //BONUS
            'ADD DEPARTMENT', //DONE
            'ADD EMPLOYEE', //DONE
            'ADD ROLE', //DONE
            'UPDATE EMPLOYEE ROLE', //DONE 
            // 'UPDATE EMPLOYEES MANAGER', //BONUS
            // 'DELETE A DEPARTMENT', //BONUS 
            // 'DELETE AN EMPLOYEE', //BONUS
            // 'DELETE A ROLE', //BONUS  
            'QUIT'
        ],
        name: 'type',
    })
        .then((answers) => {
            initialPrompt(answers.type);
        });
};

start = () => {
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
╚ ╝╚══════════════════╚══╝════════════╝╚ ╝`
)
    init();
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

start();