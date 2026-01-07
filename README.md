# Praxis Auto Sorter

A local web application that automates the quarterly task of setting up Praxis bots for Capella University courses.

## The Problem

Every quarter, configuring Course Aide bots in Praxis requires:
- Cross-referencing multiple Canvas CSV reports
- Matching instructors with their courses
- Determining which bot to assign to each course
- Manually constructing course URLs
- Creating JSON configuration files for each bot

This manual process takes hours and is prone to errors.

## The Solution

Praxis Auto Sorter provides a guided 6-step workflow that:
1. Uploads and parses Canvas CSV reports
2. Lets you map columns to required fields
3. Filters enrollments by instructor roles
4. Provides an interactive two-panel interface to assign instructors to bots
5. Generates properly formatted JSON files for Praxis LTI context
6. Saves run history for future reference

What used to take hours now takes minutes.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- A web browser

### Installation

```bash
# Clone or download the project
cd praxis_auto_sorter

# Install dependencies
npm install
```

### Running the Application

```bash
node server.js
```

Then open your browser to: **http://localhost:3000**

## Required CSV Files

You'll need 4 CSV files from Canvas:

| File | Required Columns | Source |
|------|-----------------|--------|
| **Enrollments** | user_id, course_id, role, status | Canvas Admin > Reports |
| **Courses** | course_id, course_name | Canvas Admin > Reports |
| **Users** | user_id, full_name | Canvas Admin > Reports |
| **Bots** | bot_name, bot_id | Your Praxis bot list |

## Features

- **Guided Workflow** - Step-by-step process prevents mistakes
- **Flexible Column Mapping** - Works with different CSV formats
- **Interactive Assignment** - Two-panel UI with multi-select and sorting
- **Run History** - Track and reference past provisioning sessions
- **JSON Export** - Generates Praxis-ready configuration files

## Tech Stack

- Node.js + Express.js (backend)
- HTML5 + TailwindCSS (frontend)
- SQLite (run history storage)
- PapaParse (CSV parsing)

## Known Issues & Limitations

| Issue | Description |
|-------|-------------|
| **Local Only** | Designed for local use, not production deployment |
| **No Saved Mappings** | Column mappings must be configured each run |
| **Large Files** | Very large CSVs may slow browser (client-side processing) |
| **Database Reset** | Deleting `praxis_database.db` erases run history |
| **Single User** | Not designed for concurrent multi-user access |

## Utility Scripts

Two additional Python scripts are included:

- **`add_url_script.py`** - Convert course IDs to full Capella URLs
- **`json_course_comparison.py`** - Compare two JSON course lists to find overlaps

Run with: `python add_url_script.py` or `python json_course_comparison.py`

## Documentation

- **[User Guide](USER_GUIDE.md)** - Detailed step-by-step instructions
- **[memory-bank/](memory-bank/)** - Technical documentation

## Project Structure

```
praxis_auto_sorter/
├── Quick_sort_app.html    # Main application (frontend)
├── server.js              # Express server
├── database.js            # SQLite initialization
├── package.json           # Dependencies
├── USER_GUIDE.md          # User documentation
├── memory-bank/           # Technical docs
└── .claude/               # Claude Code configuration
```

## Contributing

This is an internal tool for Capella University. For issues or suggestions, contact the development team.

## License

Internal use only - Capella University
