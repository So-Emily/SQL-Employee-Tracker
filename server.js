const { Client } = require('pg');
const inquirer = require('inquirer');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'password',
    port: 3001,
});

client.connect();

async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        },
    ]);

    switch (answers.action) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            client.end();
            return;
    }

    mainMenu();
}

async function viewAllDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

async function viewAllRoles() {
    const res = await client.query('SELECT * FROM role');
    console.table(res.rows);
}

// Define other functions like viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole here
async function viewAllEmployees() {
    const res = await client.query('SELECT * FROM employee');
    console.table(res.rows);
}

async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ]);

    await client.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
}

async function addRole() {
    const departments = await client.query('SELECT * FROM department');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong to?',
            choices: departments.rows.map(department => ({
                name: department.name,
                value: department.id,
            })),
        },
    ]);

    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
        answers.title,
        answers.salary,
        answers.department_id,
    ]);
}

async function addEmployee() {
    const roles = await client.query('SELECT * FROM role');
    const employees = await client.query('SELECT * FROM employee');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the role of the employee?',
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id,
            })),
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the manager of the employee?',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            })),
        },
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
        answers.first_name,
        answers.last_name,
        answers.role_id,
        answers.manager_id,
    ]);
}

async function updateEmployeeRole() {
    const employees = await client.query('SELECT * FROM employee');
    const roles = await client.query('SELECT * FROM role');
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            })),
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the new role of the employee?',
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id,
            })),
        },
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
}


// Call the mainMenu function to start the interactive menu
mainMenu();