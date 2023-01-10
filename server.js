// REQUIRED DEPENDENCIES
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');
// LINK TO DATABASE SQL
const db = mysql.createConnection({
    user: "root",
    database: "employee_db"
});
// SWITCH CASE STATEMENT TO TRIGGER CORRESPONDING FUNCTION
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
        case 'VIEW A DEPARTMENTS TOTAL UTILIZED BUDGET':
            viewDepartmentBudget();
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
        case 'UPDATE EMPLOYEES MANAGER':
            updateEmployeeManager();
            break;
        case 'UPDATE EMPLOYEE ROLE':
            updateEmployeeRole();
            break;
        case 'DELETE A DEPARTMENT':
            deleteDepartment();
            break;
        case 'DELETE AN EMPLOYEE':
            deleteEmployee();
            break;
        case 'DELETE A ROLE':
            deleteRole();
            break;
        case 'QUIT':
            quit();
            break;
    }
};
// FUNCTION TO DISPLAY ALL DEPARTMENTS
viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error('Error Viewing All Departments');
        console.table(departments);
        init();
    });
};
// FUNCTION TO DISPLAY ALL EMPLOYEES
viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error('Error Viewing All Employees');
        console.table(employees);
        init();
    });
};
// FUNCTION TO DISPLAY ALL ROLES
viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

viewEmployeesByManager = () => {
    db.query('SELECT * FROM employee', (err, employee) => {
        if (err) throw console.error('Error Viewing Employees By Manager');
    })
}

// NEEDS WORK BONUS
viewDepartmentBudget = () => {
    db.query('SELECT * FROM role JOIN department ON role.department_id = department.id ', (err, departments) => {
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
            // db.query('', {

            // })
        })
    })
    init();
};
// FUNCTION TO ADD A DEPARTMENT TO DATABASE
addDepartment = () => {
    prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'Enter the name of the new department you would like to add.'
        }
    ]).then((answers) => {
        console.table([answers])
        // GRABBING ADDED DEPARTMENT NAME AND INSERTING INTO DATABASE
        db.query(`INSERT INTO department (name) VALUES ('${answers.addDepartment}');`,
            (err, res) => {
                console.table(res)
                if (err) throw console.error(err);
                init();
            })
    })
};
// FUNCTION TO ADD AN EMPLOYEE TO DATABASE
addEmployee = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
        const possibleRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
        console.log('POSSIBLE ROLES', possibleRoles)
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw console.error(err);
            const possibleManagers = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
            console.log('POSSIBLE MANAGERS', possibleManagers)
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
                // GRABBING PROMPT ANSWERS AND CREATING A NEW EMPLOYEE IN DATABASE
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}','${answers.lastName}',${answers.role},${answers.manager});`,
                    (err, res) => {
                        console.table(res)
                        if (err) throw console.error(err)
                        init();
                    })
            })
        });
    })
};
// FUNCTION TO ADD A NEW ROLE TO DATABASE
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
            // GRABBING PROMPT ANSWERS AND CREATING A NEW ROLE IN DATABASE
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${answers.department});`,
                (err, res) => {
                    console.table(res)
                    if (err) throw console.error(err);
                    init();
                })
        })
    });
};
// FUNCTION TO UPDATE AN EMPLOYEES ROLE IN DATABASE
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
                // GRABBING PROMPT ANSWERS AND UPDATING SPECIFIED EMPLOYEES ROLE IN DATABASE
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
// FUNCTION TO DELETE AN EMPLOYEE FROM DATABASE
deleteEmployee = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error(err);
        const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.role_id }));
        console.log('AllEmployees', grabEmployees);
        prompt([
            {
                name: 'employee',
                type: 'list',
                message: "Which employee would you like to delete from database?",
                choices: grabEmployees
            }
        ]).then((answers) => {
            console.log([answers])
            // GRABBING PROMPT ANSWERS AND DELETING SPECIFIED EMPLOYEE FROM DATABASE
            db.query(`DELETE FROM employee WHERE role_id = ${answers.employee}`, (err, res) => {
                console.table(res)
                if (err) {
                    throw console.error(err)
                }
            })
            init();
        })
    })
};

// FUNCTION TO DELETE A ROLE FROM DATABASE
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
            // GRABBING PROMPT ANSWERS AND DELETING SPECIFIED ROLE FROM DATABASE
            db.query(`DELETE FROM role WHERE department_id = ${answers.roles}`,
                (err, res) => {
                    console.table(res)
                    if (err) {
                        throw console.error(err)
                    }
                })
        })
        init();
    })
};

// FUNCTION TO DELETE A DEPARTMENT FROM DATABASE
deleteDepartment = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error(err);
        const grabDepartments = departments.map(department => ({ name: department.name, value: department.id }));
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
            // GRABBING PROMPT ANSWERS AND DELETING SPECIFIED DEPARTMENT FROM DATABASE
            db.query(`DELETE FROM department WHERE department.id = ${answers.departments}`,
                (err, res) => {
                    console.table(res);
                    if (err) {
                        throw console.error(err);
                    }
                })
        })
        init();
    })
};
// PROMPT INITALIZER FOR LIST OF CHOICES
const init = () => {
    prompt({
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'VIEW ALL DEPARTMENTS', //DONE
            'VIEW ALL EMPLOYEES', //DONE
            'VIEW ALL ROLES', //DONE
            // 'VIEW EMPLOYEES BY DEPARTMENT', //BONUS NEED WORK
            // 'VIEW EMPLOYEES BY MANAGER', //BONUS NEED WORK
            // 'VIEW A DEPARTMENTS TOTAL UTILIZED BUDGET', //BONUS NEED WORK
            'ADD DEPARTMENT', //DONE
            'ADD EMPLOYEE', //DONE
            'ADD ROLE', //DONE
            'UPDATE EMPLOYEE ROLE', //DONE 
            // 'UPDATE EMPLOYEES MANAGER', //BONUS NEED WORK
            'DELETE A DEPARTMENT', //BONUS DONE
            'DELETE AN EMPLOYEE', //BONUS DONE
            'DELETE A ROLE', //BONUS DONE  
            'QUIT' //DONE
        ],
        name: 'type',
    })
        .then((answers) => {
            initialPrompt(answers.type);
        });
};
// ONLY ON START UP FOR NODE SERVER.JS CONSOLE.INFO FANCY DISPLAY
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
// FUNCTION TO CONFIRM EXIT OF PROMPT SYSTEM ON CONFIRM IF NOT RETURN TO LIST OF CHOICES PROMPT
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