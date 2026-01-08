const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'praxis_database.db');

let db = null;
let SQL = null;

// Save database to disk
function saveDb() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// Initialize and return the database
async function openDb() {
    if (db) {
        return createDbWrapper();
    }

    SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    return createDbWrapper();
}

// Create a wrapper with async-like interface for compatibility with server.js
function createDbWrapper() {
    return {
        // Execute a query that modifies data (INSERT, UPDATE, DELETE)
        run(sql, ...params) {
            try {
                db.run(sql, params);
                saveDb();
                // Return lastID for INSERT operations
                const lastID = db.exec("SELECT last_insert_rowid()")[0]?.values[0][0];
                const changes = db.getRowsModified();
                return { lastID, changes };
            } catch (err) {
                err.code = err.message.includes('UNIQUE constraint') ? 'SQLITE_CONSTRAINT' : err.code;
                throw err;
            }
        },

        // Get all matching rows
        all(sql, ...params) {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            const results = [];
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();
            return results;
        },

        // Get a single row
        get(sql, ...params) {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            let result = null;
            if (stmt.step()) {
                result = stmt.getAsObject();
            }
            stmt.free();
            return result;
        },

        // Close is a no-op since we keep DB in memory
        close() {
            // Save on close just to be safe
            saveDb();
        }
    };
}

// Setup the database schema
async function setupDatabase() {
    const dbWrapper = await openDb();

    // Check if table exists and get its columns
    const tableInfo = dbWrapper.all("PRAGMA table_info(provisioning_runs)");
    const existingColumns = tableInfo.map(col => col.name);

    if (existingColumns.length === 0) {
        // Table doesn't exist - create with full schema
        dbWrapper.run(`
            CREATE TABLE IF NOT EXISTS provisioning_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                runName TEXT NOT NULL UNIQUE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL DEFAULT 'in_progress',
                currentStep INTEGER NOT NULL DEFAULT 0,
                columnMap TEXT,
                instructorRoles TEXT,
                unassignedEnrollments TEXT,
                assignments TEXT,
                botList TEXT,
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
                dbWrapper.run(`ALTER TABLE provisioning_runs ADD COLUMN ${col.name} ${col.definition}`);
                console.log(`Added column: ${col.name}`);
            }
        }

        // Mark existing runs as completed (they were saved at Step 5)
        dbWrapper.run(`UPDATE provisioning_runs SET status = 'completed', currentStep = 5 WHERE status IS NULL OR status = ''`);

        console.log('Database migration complete.');
    }
}

// Run setup
setupDatabase().catch(err => {
    console.error('Failed to setup database:', err);
    process.exit(1);
});

module.exports = { openDb };
