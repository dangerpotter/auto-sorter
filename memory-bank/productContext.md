# Product Context: Praxis Auto Sorter

## Problem Statement

Every quarter, a significant amount of manual effort is required to configure course assistant bots in a third-party tool called Praxis. This process is time-consuming, repetitive, and prone to human error. The current manual workflow involves:

1.  Manually cross-referencing multiple CSV files (`courses.csv`, `enrollments.csv`, `users.csv`) to match instructors with their courses.
2.  Manually determining which bot (generic "Course Aide" or custom instructor bot) to assign based on instructor type (full-time vs. part-time) and program specifics.
3.  Manually constructing course URLs from Canvas course IDs.
4.  Manually creating and organizing JSON files for each bot's LTI context, which tells the bot which courses to appear in.

This manual process is a bottleneck and a significant administrative burden.

## User Experience Goals

The goal is to replace the manual process with a powerful, guided, and persistent application that dramatically speeds up the workflow.

The ideal user experience is:
1.  The user starts a local web server by running a single command (`node server.js`).
2.  The user opens the application in their browser, where they can name the current run and see a history of past runs.
3.  The application guides the user through a series of steps: uploading the necessary CSV files (including a new one for bots), mapping columns, and selecting instructor roles.
4.  The core of the experience is an interactive assignment workspace where the user can efficiently sort instructors into bot groups using a multi-select table and assignment buttons.
5.  The application generates the final JSON files, ready for download.
6.  The results of the run are saved to a local database, so the user has a persistent record of all previous provisioning sessions.

The solution should be reliable, fast, and transform a multi-hour manual task into a process that takes only a few minutes, while still giving the user full control over the final assignments.
