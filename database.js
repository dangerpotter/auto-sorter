const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// This function will open the database connection
async function openDb() {
    return open({
        filename: './praxis_database.db',
        driver: sqlite3.Database
    });
}

// This function will set up the database tables
async function setupDatabase() {
    const db = await openDb();

    // Check if table exists and get its columns
    const tableInfo = await db.all("PRAGMA table_info(provisioning_runs)");
    const existingColumns = tableInfo.map(col => col.name);

    if (existingColumns.length === 0) {
        // Table doesn't exist - create with full schema
        // CSV files are stored on disk in runs/<id>/ folder, not in database
        await db.run(`
            CREATE TABLE IF NOT EXISTS provisioning_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                runName TEXT NOT NULL UNIQUE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL DEFAULT 'in_progress',
                currentStep INTEGER NOT NULL DEFAULT 0,

                -- Step 2-4 state (small JSON, CSV files stored on disk)
                columnMap TEXT,
                instructorRoles TEXT,
                unassignedEnrollments TEXT,
                assignments TEXT,
                botList TEXT,

                -- Final output
                jsonData TEXT
            )
        `);
        console.log('Database table created with full schema.');
    } else {
        // Table exists - migrate by adding missing columns
        const newColumns = [
            { name: 'updatedAt', definition: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
            { name: 'status', definition: "TEXT NOT NULL DEFAULT 'in_progress'" },
            { name: 'currentStep', definition: 'INTEGER NOT NULL DEFAULT 0' },
            { name: 'columnMap', definition: 'TEXT' },
            { name: 'instructorRoles', definition: 'TEXT' },
            { name: 'unassignedEnrollments', definition: 'TEXT' },
            { name: 'assignments', definition: 'TEXT' },
            { name: 'botList', definition: 'TEXT' },
        ];

        for (const col of newColumns) {
            if (!existingColumns.includes(col.name)) {
                await db.run(`ALTER TABLE provisioning_runs ADD COLUMN ${col.name} ${col.definition}`);
                console.log(`Added column: ${col.name}`);
            }
        }

        // Mark existing runs as completed (they were saved at Step 5)
        await db.run(`UPDATE provisioning_runs SET status = 'completed', currentStep = 5 WHERE status IS NULL OR status = ''`);

        console.log('Database migration complete.');
    }

    await db.close();
}

// Run setup
setupDatabase().catch(err => {
    console.error('Failed to setup database:', err);
    process.exit(1);
});

module.exports = { openDb };
