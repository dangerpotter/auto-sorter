# Praxis Auto Sorter - User Guide

This guide walks you through using the Praxis Auto Sorter application to set up Course Aide bots for a new quarter.

---

## Part 1: Getting Started

### What You'll Need

Before starting, gather these items:

1. **Canvas CSV Reports** (download from Canvas Admin)
   - Enrollments report
   - Courses report
   - Users report

2. **Bots CSV** (your Praxis bot list)
   - A spreadsheet with bot names and IDs

3. **Node.js installed** on your computer
   - Download from: https://nodejs.org

### Starting the Application

1. Open a terminal/command prompt
2. Navigate to the project folder:
   ```
   cd praxis_auto_sorter
   ```
3. If this is your first time, install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   node server.js
   ```
5. Open your web browser and go to: **http://localhost:3000**

You should see the Praxis Auto Sorter welcome screen.

---

## Part 2: The 6-Step Workflow

### Step 0: Run Configuration

**What happens here:** Name your provisioning run and view past runs.

**Instructions:**
1. Enter a descriptive name for this run (e.g., "Winter 2026" or "Spring 2026 - MBA")
2. Review the history table to see previous runs (if any)
3. Click **"Start New Run"** to proceed

**Tips:**
- Use consistent naming conventions (e.g., always include the quarter/year)
- The name must be unique - you can't reuse a previous run name

---

### Step 1: File Upload

**What happens here:** Upload the 4 required CSV files.

**Instructions:**
1. For each file type, either:
   - Click the upload area and select the file, OR
   - Drag and drop the file onto the upload area
2. You'll see a checkmark when each file is successfully loaded
3. Once all 4 files show checkmarks, click **"Next"**

**The 4 Required Files:**

| File | What It Contains | Where to Get It |
|------|-----------------|-----------------|
| **Enrollments CSV** | Who is enrolled in which course | Canvas Admin > Reports > Enrollments |
| **Courses CSV** | Course IDs and names | Canvas Admin > Reports > Courses |
| **Users CSV** | User IDs and names | Canvas Admin > Reports > Users |
| **Bots CSV** | Your Praxis bot list | Create from your bot inventory |

**Bots CSV Format Example:**
```csv
instanceAIName,instanceName
Course Aide - BHA,ch_bha
Course Aide - NURS,ch_nurs
Dr. Smith Bot,smith_bot
```

---

### Step 2: Column Mapping

**What happens here:** Tell the app which columns contain which data.

**Instructions:**
1. For each required field, select the matching column from the dropdown
2. The app shows you the columns it found in each CSV
3. Click **"Next"** when all fields are mapped

**Required Mappings:**

| Category | Field | Description |
|----------|-------|-------------|
| **Bots** | Bot Name | The display name of the bot |
| **Bots** | Bot ID | The technical identifier |
| **Enrollments** | User ID | Links to users |
| **Enrollments** | Course ID | Links to courses |
| **Enrollments** | Role | e.g., "Instructor", "Student" |
| **Enrollments** | Status | e.g., "active", "inactive" |
| **Courses** | Course ID | The Canvas course ID |
| **Courses** | Course Name | The course title |
| **Users** | User ID | The Canvas user ID |
| **Users** | User Name | The person's full name |

**Tips:**
- If column names don't match exactly, look for similar names
- Common Canvas columns: `canvas_user_id`, `canvas_course_id`, `short_name`

---

### Step 3: Role Selection

**What happens here:** Select which enrollment roles represent instructors.

**Instructions:**
1. Review the list of roles found in your enrollments file
2. Check the boxes next to roles that represent instructors
3. Click **"Next"**

**Common Instructor Roles:**
- Instructor
- Lead Instructor
- Teacher
- Primary Instructor

**Do NOT select:**
- Student
- Observer
- TA (unless they need bot access)
- Designer

---

### Step 4: Instructor Assignment (Main Workspace)

**What happens here:** Assign instructors to their appropriate bots.

**The Interface:**

```
┌─────────────────────────┐    ┌─────────────────────────┐
│  UNASSIGNED INSTRUCTORS │    │     ASSIGNED TO BOT     │
│  ┌───┬────────┬───────┐ │    │  [Select Bot ▼]         │
│  │ ☐ │ Name   │Course │ │    │                         │
│  │ ☐ │ Smith  │ MBA501│ │    │  Course Aide - BHA (5)  │
│  │ ☐ │ Jones  │ NURS10│ │    │  • Smith - MBA501       │
│  └───┴────────┴───────┘ │    │  • Adams - MBA502       │
│                         │    │                         │
│    [Assign →]           │    │    [← Unassign]         │
└─────────────────────────┘    └─────────────────────────┘
```

**Instructions:**

1. **To assign instructors:**
   - Select a bot from the dropdown on the right
   - Check the boxes next to instructors on the left
   - Click **"Assign →"**

2. **To unassign instructors:**
   - Click on a bot group to expand it
   - Check the boxes next to instructors to unassign
   - Click **"← Unassign"**

3. **To sort the unassigned list:**
   - Click the "Instructor" or "Course" column header
   - Click again to reverse the sort order

4. When all instructors are assigned, click **"Next"**

**Tips:**
- Use Ctrl+Click or Shift+Click to select multiple instructors
- Sort by course name to group similar courses together
- The count next to each bot shows how many instructors are assigned

---

### Step 5: Generate & Download

**What happens here:** Generate and save the final JSON files.

**Instructions:**
1. Review the generated JSON for each bot
2. Each text area shows the JSON content for one bot
3. Copy the JSON content or use it as needed
4. Click **"Save Run"** to save this session to the database
5. Optionally, click **"Start Over"** to begin a new run

**Output Format:**
```json
[
  "https://courseroom.capella.edu/courses/54321",
  "https://courseroom.capella.edu/courses/54322",
  "https://courseroom.capella.edu/courses/54323"
]
```

Each JSON file contains an array of course URLs where that bot should be active.

---

## Part 3: Tips & Best Practices

### Before You Start

1. **Verify your CSVs** - Open them in Excel first to confirm they have the expected columns
2. **Check for duplicates** - Same instructor in multiple roles can cause issues
3. **Clean your bot list** - Remove any inactive or deprecated bots

### During Assignment

1. **Work systematically** - Assign by program or department to avoid missing anyone
2. **Use sorting** - Sort by course name to group related courses
3. **Double-check counts** - Verify the bot assignment counts look reasonable

### After Completion

1. **Save your run** - Always save to preserve the history
2. **Verify JSON output** - Spot-check a few URLs to ensure correctness
3. **Document any manual changes** - If you edited JSON manually, note it

---

## Part 4: Troubleshooting

### "No instructors found"

**Cause:** The role selection didn't match any enrollments.

**Fix:** Go back to Step 3 and verify you selected the correct roles. Check your enrollments CSV to see what role names are actually used.

### "Column not found"

**Cause:** The expected column name doesn't exist in your CSV.

**Fix:** Check your CSV file headers. Canvas reports may use different column names than expected. Map to the equivalent column.

### "Run name already exists"

**Cause:** You tried to use a name from a previous run.

**Fix:** Choose a unique name. Add a date or version number if needed (e.g., "Winter 2026 v2").

### Application won't start

**Cause:** Node.js isn't installed or dependencies are missing.

**Fix:**
1. Verify Node.js is installed: `node --version`
2. Run `npm install` in the project folder
3. Try starting again: `node server.js`

### Browser shows blank page

**Cause:** Server isn't running or wrong URL.

**Fix:**
1. Check the terminal - is the server running?
2. Make sure you're going to: http://localhost:3000
3. Try refreshing the page

---

## Part 5: For Technical Users

### Architecture Overview

The application uses a client-server architecture:

- **Frontend:** Single-page HTML application (`Quick_sort_app.html`)
- **Backend:** Node.js/Express server (`server.js`)
- **Database:** SQLite for run history (`praxis_database.db`)

All CSV processing happens in the browser using PapaParse. The server only handles run history storage.

### Database Management

**Location:** `praxis_database.db` in the project root

**View run history via SQLite:**
```bash
sqlite3 praxis_database.db "SELECT id, runName, createdAt FROM provisioning_runs"
```

**Export a past run's JSON:**
```bash
sqlite3 praxis_database.db "SELECT jsonData FROM provisioning_runs WHERE runName='Winter 2026'"
```

**Reset the database:**
Delete `praxis_database.db` - it will be recreated on next server start.

### API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/runs` | GET | Fetch all run history |
| `/api/runs` | POST | Save a new run |

**POST body format:**
```json
{
  "runName": "Winter 2026",
  "jsonData": {
    "Bot Name": ["url1", "url2"]
  }
}
```

### Utility Scripts

#### add_url_script.py

Converts course ID numbers to full Capella URLs.

```bash
python add_url_script.py
```

Enter course IDs (one per line or comma-separated), click Generate, and get a JSON array of URLs.

#### json_course_comparison.py

Compares two JSON URL lists to find overlaps.

```bash
python json_course_comparison.py
```

Paste two JSON arrays, click Compare, and see which courses appear in both.

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
node server.js

# The server watches for file changes automatically
```

### Modifying the Application

| Change | File to Edit |
|--------|--------------|
| UI/workflow steps | `Quick_sort_app.html` |
| API endpoints | `server.js` |
| Database schema | `database.js` |
| Base URL for courses | `Quick_sort_app.html` (search for "courseroom.capella.edu") |

See `.CLAUDE.md` for detailed development guidance.

---

## Appendix: Sample CSV Structures

### enrollments.csv
```csv
canvas_user_id,canvas_course_id,role,status,section_name
12345,54321,Instructor,active,MBA-FP5001-01
12346,54321,Student,active,MBA-FP5001-01
```

### courses.csv
```csv
canvas_course_id,short_name,long_name,status,start_date
54321,MBA-FP5001-01,MBA Foundations,active,2026-01-06
```

### users.csv
```csv
canvas_user_id,login_id,full_name,email,status
12345,jsmith,John Smith,jsmith@capella.edu,active
```

### bots.csv
```csv
instanceAIName,instanceName
Course Aide - MBA,ch_mba
Course Aide - NURS,ch_nurs
```
