# System Patterns: Praxis Auto Sorter

## System Architecture

The application now follows a client-server architecture, running locally on the user's machine.

-   **Backend (Server):**
    -   A Node.js server using the Express.js framework.
    -   It serves the static `Quick_sort_app.html` file as the main user interface.
    -   It exposes a set of RESTful API endpoints to interact with the database (e.g., `/api/runs`).
    -   It communicates with an SQLite database to persist data between sessions.

-   **Frontend (Client):**
    -   A Single-Page Application (SPA) running in the user's browser.
    -   Handles all user interactions through a multi-step, guided workflow.
    -   Parses user-uploaded CSV files directly in the browser using PapaParse.
    -   Performs all data joining and processing in memory (JavaScript).
    -   Communicates with the backend via `fetch` API calls to save the results of a provisioning run and load the history of past runs.

-   **Database:**
    -   An SQLite database file (`praxis_database.db`) stores the history of all provisioning runs.
    -   This provides data persistence, allowing the user to view and reference past work.

## Data Flow

1.  **Initialization:** The user starts the Node.js server.
2.  **App Load:** The user navigates to `http://localhost:3000`. The server serves the HTML file. The frontend makes an API call to `GET /api/runs` to display the history.
3.  **User Input:** The user names the run and uploads the four required CSV files (`enrollments`, `courses`, `users`, `bots`).
4.  **Client-Side Processing:**
    -   The browser parses all CSVs.
    -   The user is guided through column mapping and instructor role selection.
    -   The data is joined in-memory to create a list of unassigned instructor enrollments.
5.  **Interactive Assignment:**
    -   The user interacts with a two-panel UI to assign instructors from a sortable table to bot groups. This state is managed entirely on the client.
6.  **JSON Generation:** Once assignments are complete, the frontend generates the final JSON files for each bot.
7.  **Data Persistence:** The frontend sends the final generated JSON data along with the run name to the backend via a `POST` request to `/api/runs`, where it is saved in the SQLite database.

## Design Patterns

-   **Client-Server Architecture:** Clear separation between the backend (data storage, API) and the frontend (UI, client-side logic).
-   **Single-Page Application (SPA):** The frontend provides a fluid user experience without full page reloads.
-   **RESTful API:** The communication between the frontend and backend follows REST principles.
-   **Stateful Backend / Ephemeral Frontend:** The backend maintains the long-term state (run history), while the frontend manages the temporary state of a single provisioning session.
