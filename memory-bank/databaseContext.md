# Database Context: Praxis Auto Sorter

The application uses a local SQLite database named `praxis_database.db` to provide data persistence for the history of provisioning runs.

## Connection Details

-   **Driver:** `sqlite3`
-   **Wrapper:** `sqlite` (for async/await support)
-   **Database File:** `./praxis_database.db` (located in the project root)

## Schema Overview

The database contains a single table: `provisioning_runs`.

### `provisioning_runs` Table

This table stores a record of each completed provisioning session.

-   **`id`** (INTEGER, PRIMARY KEY, AUTOINCREMENT): A unique identifier for each run.
-   **`runName`** (TEXT, NOT NULL, UNIQUE): A user-provided name for the run (e.g., "Fall 2025"). This must be unique.
-   **`createdAt`** (DATETIME, DEFAULT CURRENT_TIMESTAMP): A timestamp of when the run was saved.
-   **`jsonData`** (TEXT): A JSON string containing the complete output of the run, mapping each bot name to its array of course URLs.
