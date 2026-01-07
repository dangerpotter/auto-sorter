const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;
const { openDb } = require('./database');

// Ensure runs directory exists
const runsDir = path.join(__dirname, 'runs');
if (!fs.existsSync(runsDir)) {
    fs.mkdirSync(runsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const runDir = path.join(runsDir, req.params.id);
        if (!fs.existsSync(runDir)) {
            fs.mkdirSync(runDir, { recursive: true });
        }
        cb(null, runDir);
    },
    filename: (req, file, cb) => {
        // Use the fieldname as filename (enrollments, courses, users, bots)
        cb(null, file.fieldname + '.csv');
    }
});
const upload = multer({ storage });

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.json()); // No longer need large limit - CSV files uploaded separately

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Quick_sort_app.html'));
});

// --- API Routes ---

// GET /api/runs - Fetch all past provisioning runs
app.get('/api/runs', async (req, res) => {
    try {
        const db = await openDb();
        const runs = await db.all('SELECT id, runName, createdAt, updatedAt, status, currentStep FROM provisioning_runs ORDER BY updatedAt DESC');
        res.json(runs);
    } catch (error) {
        console.error('Failed to fetch runs:', error);
        res.status(500).json({ error: 'Failed to fetch runs' });
    }
});

// GET /api/runs/:id - Fetch complete run state for resuming
app.get('/api/runs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await openDb();
        const run = await db.get('SELECT * FROM provisioning_runs WHERE id = ?', id);
        if (!run) {
            return res.status(404).json({ error: 'Run not found' });
        }
        res.json(run);
    } catch (error) {
        console.error('Failed to fetch run:', error);
        res.status(500).json({ error: 'Failed to fetch run' });
    }
});

// PUT /api/runs/:id - Update run state (auto-save) - metadata only, no CSV data
// NOTE: unassignedEnrollments is NOT saved - it's recomputed from CSV files on resume
app.put('/api/runs/:id', async (req, res) => {
    const { id } = req.params;
    const {
        currentStep,
        columnMap,
        instructorRoles,
        assignments,
        botList
    } = req.body;

    try {
        const db = await openDb();

        // Build dynamic update query based on provided fields
        const updates = [];
        const values = [];

        if (currentStep !== undefined) { updates.push('currentStep = ?'); values.push(currentStep); }
        if (columnMap !== undefined) { updates.push('columnMap = ?'); values.push(JSON.stringify(columnMap)); }
        if (instructorRoles !== undefined) { updates.push('instructorRoles = ?'); values.push(JSON.stringify(instructorRoles)); }
        if (assignments !== undefined) { updates.push('assignments = ?'); values.push(JSON.stringify(assignments)); }
        if (botList !== undefined) { updates.push('botList = ?'); values.push(JSON.stringify(botList)); }

        // Always update the timestamp
        updates.push('updatedAt = CURRENT_TIMESTAMP');
        values.push(id);

        if (updates.length === 1) {
            // Only timestamp update, nothing else provided
            return res.status(400).json({ error: 'No fields to update' });
        }

        await db.run(
            `UPDATE provisioning_runs SET ${updates.join(', ')} WHERE id = ?`,
            ...values
        );

        const updated = await db.get('SELECT updatedAt FROM provisioning_runs WHERE id = ?', id);
        res.json({ success: true, updatedAt: updated.updatedAt });
    } catch (error) {
        console.error('Failed to update run:', error);
        res.status(500).json({ error: 'Failed to update run' });
    }
});

// POST /api/runs/:id/files - Upload CSV files for a run
app.post('/api/runs/:id/files', upload.fields([
    { name: 'enrollments', maxCount: 1 },
    { name: 'courses', maxCount: 1 },
    { name: 'users', maxCount: 1 },
    { name: 'bots', maxCount: 1 }
]), async (req, res) => {
    try {
        const uploadedFiles = Object.keys(req.files).map(key => key + '.csv');
        res.json({ success: true, files: uploadedFiles });
    } catch (error) {
        console.error('Failed to upload files:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});

// GET /api/runs/:id/files/:filename - Download a CSV file
app.get('/api/runs/:id/files/:filename', (req, res) => {
    const { id, filename } = req.params;
    const allowedFiles = ['enrollments.csv', 'courses.csv', 'users.csv', 'bots.csv'];

    if (!allowedFiles.includes(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(runsDir, id, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
});

// PUT /api/runs/:id/complete - Mark run as completed
app.put('/api/runs/:id/complete', async (req, res) => {
    const { id } = req.params;
    const { jsonData } = req.body;

    try {
        const db = await openDb();
        await db.run(
            `UPDATE provisioning_runs SET status = 'completed', jsonData = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            JSON.stringify(jsonData),
            id
        );
        res.json({ success: true, message: 'Run marked as completed' });
    } catch (error) {
        console.error('Failed to complete run:', error);
        res.status(500).json({ error: 'Failed to complete run' });
    }
});

// POST /api/runs - Create a new provisioning run
app.post('/api/runs', async (req, res) => {
    const { runName } = req.body;
    if (!runName) {
        return res.status(400).json({ error: 'runName is required' });
    }
    try {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO provisioning_runs (runName) VALUES (?)',
            runName
        );

        // Create folder for run's CSV files
        const runDir = path.join(runsDir, String(result.lastID));
        if (!fs.existsSync(runDir)) {
            fs.mkdirSync(runDir, { recursive: true });
        }

        res.status(201).json({
            id: result.lastID,
            runName: runName,
            message: 'Run created successfully'
        });
    } catch (error) {
        console.error('Failed to create run:', error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: `A run with the name "${runName}" already exists.` });
        }
        res.status(500).json({ error: 'Failed to create run' });
    }
});


app.listen(port, () => {
    console.log(`Praxis Auto Sorter server listening at http://localhost:${port}`);
});
