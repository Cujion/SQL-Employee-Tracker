DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE IF NOT EXISTS employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

/* SELECT 
FROM role
JOIN department ON role.department_id = department.id */

/* SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  role.salary,
  CONCAT(
    manager.first_name,
    ' ',
    manager.last_name
  ) AS manager
FROM employee
JOIN role
ON employee.role_id = role.id
JOIN employee AS manager
ON employee.manager_id = manager.id */


/* VIEW BUDGET BY DEPARTMENT */
/* SELECT 
name,
salary
FROM department
JOIN role ON 
department.id = role.department_id */

/* SELECT 
department.name,
SUM(
role.salary
) AS department_salary
FROM department
JOIN role ON 
department.id = role.department_id 
GROUP BY name

/* SELECT *
FROM department
JOIN role ON 
department.id = role.department_id */