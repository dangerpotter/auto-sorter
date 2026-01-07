# API Documentation: Praxis Auto Sorter

The application's backend exposes a simple RESTful API to manage the history of provisioning runs.

## Endpoints

### `GET /api/runs`

-   **Description:** Fetches a list of all previously completed provisioning runs.
-   **Method:** `GET`
-   **Response (Success):** `200 OK`
    -   **Body:** An array of run objects.
        ```json
        [
            {
                "id": 1,
                "runName": "Fall 2025",
                "createdAt": "2025-09-27T18:30:00.000Z"
            },
            {
                "id": 2,
                "runName": "Winter 2026",
                "createdAt": "2026-01-15T14:00:00.000Z"
            }
        ]
        ```

### `POST /api/runs`

-   **Description:** Saves a new, completed provisioning run to the database.
-   **Method:** `POST`
-   **Request Body:** A JSON object containing the run name and the generated JSON data.
    ```json
    {
        "runName": "Spring 2026",
        "jsonData": {
            "Course Aide - BHA": [
                "https://courseroom.capella.edu/courses/12345",
                "https://courseroom.capella.edu/courses/67890"
            ],
            "Dr. Bella-Bot": [
                "https://courseroom.capella.edu/courses/54321"
            ]
        }
    }
    ```
-   **Response (Success):** `201 Created`
    -   **Body:**
        ```json
        {
            "message": "Run saved successfully"
        }
        ```
-   **Response (Error):**
    -   `400 Bad Request`: If `runName` or `jsonData` is missing.
    -   `409 Conflict`: If a run with the same `runName` already exists.
    -   `500 Internal Server Error`: For any other server-side errors.
