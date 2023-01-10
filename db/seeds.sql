USE employee_db;

INSERT INTO department (name)
VALUES
 ('Sales'), /* 1 */
('Engineering'), /* 2 */
('Finance'), /* 3 */
('Legal'); /* 4 */

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1), /* Sales */
('Salesperson', 80000, 1), /* Sales */
('Lead Engineer', 150000, 2), /* Engineering */
('Software Engineer', 120000, 2), /* Engineering */
('Account Manager', 160000, 3), /* Finance */
('Accountant', 125000, 3), /* Finance */
('Legal Team Lead', 250000, 4), /* Legal */
('Lawyer', 190000, 4); /* Legal */

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, null), /* Manager of Sales */
('Mike', 'Chan', 2, 1), /* Employee of Sales */
('Ashley', 'Rodriguez', 3, null), /* Manager of Engineering */
('Kevin', 'Tupik', 4, 3), /* Employee of Engineering */
('Kunal', 'Singh', 5, null), /* Manager of Finance */
('Malia', 'Brown', 6, 5), /* Employee of Finance */
('Sarah', 'Lourd', 7, null), /* Manager of Legal */
('Tom', 'Allen', 8, 7) /* Employee of Legal */
