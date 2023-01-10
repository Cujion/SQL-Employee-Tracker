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
                console.table(res, `Successfully added ${answers.addDepartment}\n`)
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
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw console.error(err);
            const possibleManagers = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
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
                        console.table(res, `Successfully added ${answers.firstName} ${answers.lastName}\n`)
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
                    console.table(res, `Successfully added ${answers.title}\n`)
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
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw console.error(err);
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
                    console.table(res, 'Successfully updated employees role\n')
                    if (err) throw console.error(err)
                    init();
                })
            })
        });
    })
};

// FUNCTION TO DELETE AN EMPLOYEE FROM DATABASE
deleteEmployee = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw console.error(err);
        const grabEmployees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.role_id }));
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
                console.table(res, 'Successfully deleted employee\n')
                if (err) {
                    throw console.error(err)
                }
                init();
            })
        })
    })
};

// FUNCTION TO DELETE A ROLE FROM DATABASE
deleteRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw console.error(err);
        const grabRoles = roles.map(role => ({ name: role.title, value: role.department_id }));
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
                    console.table(res, 'Successfully deleted role\n')
                    if (err) {
                        throw console.error(err)
                    }
                    init();
                })
        })
    })
};

// FUNCTION TO DELETE A DEPARTMENT FROM DATABASE
deleteDepartment = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw console.error(err);
        const grabDepartments = departments.map(department => ({ name: department.name, value: department.id }));
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
                    console.table(res, 'Successfully deleted department\n');
                    if (err) {
                        throw console.error(err);
                    }
                    init();
                })
        })
    })
};

// PROMPT INITALIZER FOR LIST OF CHOICES
const init = () => {
    prompt({
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'VIEW ALL DEPARTMENTS', 
            'VIEW ALL EMPLOYEES', 
            'VIEW ALL ROLES', 
            'ADD DEPARTMENT', 
            'ADD EMPLOYEE', 
            'ADD ROLE', 
            'UPDATE EMPLOYEE ROLE', 
            'DELETE A DEPARTMENT', 
            'DELETE AN EMPLOYEE', 
            'DELETE A ROLE', 
            'QUIT' 
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
╚ ╝╚══════════════════╚══╝════════════╝╚ ╝\n`
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
            console.info('\nTHANK YOU FOR USING EMPLOYEE MANAGER! GOODBYE!')
            db.end();
        }
    })
};

start();