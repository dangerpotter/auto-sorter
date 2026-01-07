# Project Brief: Praxis Auto Sorter

## Core Requirements and Goals

The primary goal of this project is to create an application or script that automates the quarterly task of setting up courses with a third-party tool called Praxis. This involves associating instructors with courses, assigning the correct "Course Aide" bot to each course, and generating JSON files for Praxis's LTI context.

## Project Scope

The application is a local web app that enables a user to efficiently assign instructors to bots and generate JSON files for Praxis LTI context.

The application is able to:
1.  Ingest data from four user-provided CSV files: `enrollments.csv`, `courses.csv`, `users.csv`, and a `bots.csv`.
2.  Provide a multi-step UI to guide the user through the process:
    -   **Run Configuration:** Name a provisioning run for historical tracking and view past runs.
    -   **File Upload:** Upload the four required CSVs.
    -   **Column Mapping:** Map the columns from the uploaded CSVs to the required data fields.
    -   **Role Selection:** Select which roles from the enrollments file represent instructors.
    -   **Instructor Assignment:** A two-panel workspace where the user can multi-select unassigned instructors from a sortable table and assign them to a bot selected from a dropdown.
3.  Generate the correct course URL by prepending `https://courseroom.capella.edu/courses/` to the Canvas course ID.
4.  Group all course URLs by their assigned bot.
5.  Generate the final JSON files for each bot.
6.  Save the results of each run to a local SQLite database for historical record.
