const {Client} = require('pg');
const inquirer = require('inquirer');


// create a new client
// the client will read the connection information from the .env file
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'password',
    port: 5432,
}); 

// connect to the database
client.connect();

// function to display the main menu
async function mainMenu() {
    // prompt the user for the action they want to take
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
    // switch statement to call the appropriate function based on the user's choice
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
    // call the mainMenu function again to allow the user to take another action
    mainMenu();
}

// function to view all departments
async function viewAllDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

// function to view all roles
async function viewAllRoles() {
    const res = await client.query('SELECT * FROM role');
    console.table(res.rows);
}

// function to view all employees
async function viewAllEmployees() {
    const res = await client.query('SELECT * FROM employee');
    console.table(res.rows);
}

// function to add a department
async function addDepartment() {
    // prompt the user for the name of the department
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
            validate: input => input ? true : 'Name cannot be empty',
        },
    ]);

    // insert the new department into the database
    try {
        await client.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
        console.log('Department added successfully');
    } catch (error) {
        console.error('Error adding department:', error);
    }
}

// function to add a role
async function addRole() {
    const departments = await client.query('SELECT * FROM department');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
            validate: input => input ? true : 'Title cannot be empty',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: input => !isNaN(input) ? true : 'Salary must be a number',
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

    // insert the new role into the database
    try {
        await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
            answers.title,
            answers.salary,
            answers.department_id,
        ]);
        console.log('Role added successfully');
    } catch (error) {
        console.error('Error adding role:', error);
    }
}

// function to add an employee
async function addEmployee() {
    const roles = await client.query('SELECT * FROM role');
    const employees = await client.query('SELECT * FROM employee');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
            validate: input => input ? true : 'First name cannot be empty',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
            validate: input => input ? true : 'Last name cannot be empty',
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
            choices: [{ name: 'None', value: null }].concat(
                employees.rows.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                }))
            ),
        },
    ]);
    // insert the new employee into the database
    try {
        await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
            answers.first_name,
            answers.last_name,
            answers.role_id,
            answers.manager_id,
        ]);
        console.log('Employee added successfully');
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}

// function to update an employee role
async function updateEmployeeRole() {
    const employees = await client.query('SELECT * FROM employee');
    const roles = await client.query('SELECT * FROM role');
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee\'s role do you want to update?',
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
    // update the employee's role in the database
    try {
        await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
            answers.role_id,
            answers.employee_id,
        ]);
        console.log('Employee role updated successfully');
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
}

// call the mainMenu function to start the application
mainMenu();