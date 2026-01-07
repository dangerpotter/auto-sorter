# Active Context: Praxis Auto Sorter

## Current Work Focus

The application has been significantly refactored into a client-server model with a persistent SQLite database. The core assignment logic was completely overhauled based on user feedback to provide a more intuitive, interactive workflow. The current focus is on ensuring all documentation is up-to-date before final verification.

## Recent Changes

-   **Architecture:** Shifted from a single, static HTML file to a Node.js/Express backend serving a dynamic frontend.
-   **Database:** Added an SQLite database to store the history of provisioning runs.
-   **UI/UX:**
    -   Removed the complex, rule-based assignment system.
    -   Added a new file upload for a "Bots CSV".
    -   Implemented a new "Assign Instructors" workspace featuring a two-panel layout with a sortable, multi-select table for unassigned instructors and a context-sensitive panel for assigned groups.
-   **Bug Fix:** Resolved a critical data-type mismatch bug that prevented the joining of data from different CSV files.

## Next Steps

1.  **Final Documentation Review:** Complete the update of all memory bank files to reflect the new architecture and workflow.
2.  **Final Verification:** The user will test the completed application by running the server (`node server.js`) and using the web interface to process a set of test files.
3.  **Address Feedback:** Make any final adjustments based on the user's testing.

## Active Decisions and Considerations

-   The decision was made to completely abandon the automatic, rule-based assignment logic in favor of a more flexible and user-controlled interactive table-based assignment system. This was a major pivot based on direct user feedback that the original approach did not match the real-world workflow.
-   The backend was intentionally kept simple, with its primary responsibility being to serve the application and persist run history. All complex data processing and state management for a given session remains on the client-side, which simplifies the overall architecture.
