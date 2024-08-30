const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

// Function to display the main menu
async function mainMenu() {
    // Prompt the user to choose an action
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

    // Switch statement to call the appropriate function based on the user's choice
    switch (answers.action) {
    case 'View all departments':
        return viewAllDepartments();
    case 'View all roles':
        return viewAllRoles();
    case 'View all employees':
        return viewAllEmployees();
    case 'Add a department':
        return addDepartment();
    case 'Add a role':
        return addRole();
    case 'Add an employee':
        return addEmployee();
    case 'Update an employee role':
        return updateEmployeeRole();
    case 'Exit':
        return pool.end();
    }
}

// Function to view all departments
async function viewAllDepartments() {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
    mainMenu();
}

// Function to view all roles
async function viewAllRoles() {
    const result = await pool.query('SELECT * FROM role');
    console.table(result.rows);
    mainMenu();
}

// Function to view all employees
async function viewAllEmployees() {
    const result = await pool.query('SELECT * FROM employee');
    console.table(result.rows);
    mainMenu();
}

async function addDepartment() {
    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
    },
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
    console.log('Department added!');
    mainMenu();
}

// Function to add a role
async function addRole() {
    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:',
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID for the role:',
    },
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
    answers.title,
    answers.salary,
    answers.department_id,
    ]);
    console.log('Role added!');
    mainMenu();
}

// Function to add an employee
async function addEmployee() {
    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:',
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'Enter the role ID for the employee:',
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the manager ID for the employee:',
    },
    ]);
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
    answers.first_name,
    answers.last_name,
    answers.role_id,
    answers.manager_id,
    ]);
    console.log('Employee added!');
    mainMenu();
}

// Function to update an employee role
async function updateEmployeeRole() {
    const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the ID of the employee to update:',
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'Enter the new role ID for the employee:',
    },
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log('Employee role updated!');
    mainMenu();
}

mainMenu();
