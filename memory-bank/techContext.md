# Tech Context: Praxis Auto Sorter

## Technologies Used

- **Backend:**
  - **Node.js:** The runtime environment for the server.
  - **Express.js:** A web framework used to create the local server and API endpoints.
  - **SQLite3:** The database driver for SQLite.
  - **sqlite:** A wrapper library that provides an async/await API for SQLite.

- **Frontend:**
  - **HTML5:** The structure of the web application.
  - **TailwindCSS:** A utility-first CSS framework for styling the UI.
  - **JavaScript (ES6+):** The core logic for the user interface, data manipulation, and API communication.
  - **PapaParse:** A library for parsing CSV files in the browser.

- **Database:**
  - **SQLite:** A self-contained, serverless SQL database engine used to store run history.

- **Data Formats:**
  - **Input:** The application ingests four CSV files: `enrollments`, `courses`, `users`, and `bots`.
  - **Output:** The final output is a set of JSON files formatted for Praxis LTI context.

## Development Setup

- **Dependencies:** The project's dependencies are managed via npm and are listed in `package.json`. They include `express`, `sqlite`, and `sqlite3`.
- **Running the Application:**
  1.  Install dependencies with `npm install`.
  2.  Initialize the database (if it doesn't exist) by running `node database.js` once.
  3.  Start the server with `node server.js`.
  4.  Access the application at `http://localhost:3000`.

## Technical Constraints

- The solution requires Node.js and npm to be installed on the user's machine.
- The application is designed to be run locally and is not intended for public deployment.
