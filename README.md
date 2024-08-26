# SQL Employee Tracker

## Description

The SQL Employee Tracker is a command-line application designed to manage a company's employee database. This application allows users to view and interact with information stored in a PostgreSQL database, providing a simple and efficient way to manage departments, roles, and employees.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/sql-employee-tracker.git
    ```
2. Navigate to the project directory:
    ```sh
    cd sql-employee-tracker
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Set up the PostgreSQL database:
    - Ensure PostgreSQL is installed and running.
    - Create a database named `employee_db`.
    - Run the schema script to create the necessary tables:
        ```sh
        psql -U postgres -d employee_db -f schema.sql
        ```
5. Create a `.env` file in the root directory and add your PostgreSQL connection details:
    ```env
    PGHOST=localhost
    PGUSER=your_postgres_user
    PGPASSWORD=your_postgres_password
    PGDATABASE=employee_db
    PGPORT=5432
    ```

## Usage

1. Start the application:
    ```sh
    npm start
    ```
2. Follow the prompts to view and manage departments, roles, and employees.

## Features

- View all employees
- Add a new employee
- Update an employee's role
- View all roles
- Add a new role
- View all departments
- Add a new department
- View the total utilized budget of a department

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Questions

If you have any questions about the project, please open an issue or contact the author directly at your-email@example.com.

---

© 2024 Emily Soriano. All Rights Reserved.