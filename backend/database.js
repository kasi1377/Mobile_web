const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * SQLiteDatabase - SQLite database wrapper for DKN System
 * Provides synchronous-style CRUD operations using async under the hood
 */
class SQLiteDatabase {
  constructor(dbPath = './dkn.db') {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('SQLite Database connected');
        this.db.configure('busyTimeout', 10000);
      }
    });
    this.initializeTables();
  }

  /**
   * Initialize database tables
   */
  initializeTables() {
    this.db.serialize(() => {
      // Users table (for authentication)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          isActive INTEGER DEFAULT 1,
          lastLogin TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Consultants table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS consultants (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          department TEXT,
          yearsOfExperience INTEGER,
          points INTEGER DEFAULT 0,
          contributions INTEGER DEFAULT 0,
          certifications TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Knowledge Assets table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS knowledgeAssets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          content TEXT,
          author TEXT,
          authorId TEXT,
          status TEXT DEFAULT 'pending',
          reviewStatus TEXT DEFAULT 'pending',
          reviewedBy TEXT,
          reviewComments TEXT,
          tags TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Trainings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS trainings (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT,
          instructor TEXT,
          duration INTEGER,
          level TEXT,
          status TEXT DEFAULT 'published',
          tags TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Leaderboard table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id TEXT PRIMARY KEY,
          userId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT,
          points INTEGER DEFAULT 0,
          submissions INTEGER DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          rank INTEGER,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Audit Entries table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS auditEntries (
          id TEXT PRIMARY KEY,
          action TEXT NOT NULL,
          userId TEXT,
          userName TEXT,
          targetType TEXT,
          targetId TEXT,
          changes TEXT,
          timestamp TEXT
        )
      `);

      // AI Recommendations table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS aiRecommendations (
          id TEXT PRIMARY KEY,
          consultantId TEXT NOT NULL,
          title TEXT,
          description TEXT,
          type TEXT,
          priority TEXT,
          status TEXT DEFAULT 'pending',
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Repository table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS repository (
          id TEXT PRIMARY KEY,
          assetId TEXT UNIQUE,
          title TEXT,
          category TEXT,
          status TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      // Metadata table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS metadata (
          id TEXT PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value TEXT,
          updatedAt TEXT
        )
      `);
    });
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return uuidv4();
  }

  /**
   * INSERT - Add new record (returns promise for async compatibility)
   */
  insert(table, record) {
    return new Promise((resolve, reject) => {
      const id = record.id || this.generateId();
      const now = new Date().toISOString();

      // Only add createdAt/updatedAt for tables that support them
      let data = { id, ...record };
      if (table !== 'auditEntries' && table !== 'aiRecommendations') {
        data.createdAt = record.createdAt || now;
        data.updatedAt = now;
      }

      // Filter to only columns that actually exist in the table
      this.db.all(`PRAGMA table_info(${table});`, (err, rows) => {
        if (err) {
          console.error(`Error reading schema for ${table}:`, err);
          return reject(err);
        }
        const tableInfo = rows || [];
        const columns = new Set(tableInfo.map(r => r.name));

        // Handle legacy schemas gracefully (e.g., leaderboard requiring consultantId NOT NULL)
        const hasConsultantId = tableInfo.some(r => r.name === 'consultantId');
        const consultantIdNotNull = tableInfo.some(r => r.name === 'consultantId' && r.notnull === 1);
        if (table === 'leaderboard' && hasConsultantId && consultantIdNotNull) {
          if (data.userId && !data.consultantId) {
            data.consultantId = data.userId;
          }
        }
        const keys = Object.keys(data).filter(k => columns.has(k));
        const values = keys.map(key => {
          const val = data[key];
          return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
        });

        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

        this.db.run(sql, values, function(err) {
          if (err) {
            console.error(`Error inserting into ${table}:`, err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    });
  }

  /**
   * FIND ALL - Get all records
   */
  findAll(table) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${table}`;
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error(`Error reading ${table}:`, err);
          resolve([]);
        } else {
          resolve((rows || []).map(row => this._parseRow(row)));
        }
      });
    });
  }

  /**
   * FIND BY ID - Get single record by ID
   */
  findById(table, id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${table} WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          console.error(`Error finding by id in ${table}:`, err);
          resolve(null);
        } else {
          resolve(row ? this._parseRow(row) : null);
        }
      });
    });
  }

  /**
   * FIND ONE - Get first matching record
   */
  findOne(table, criteria) {
    return new Promise((resolve, reject) => {
      const conditions = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(criteria);
      const sql = `SELECT * FROM ${table} WHERE ${conditions} LIMIT 1`;
      
      this.db.get(sql, values, (err, row) => {
        if (err) {
          console.error(`Error finding one in ${table}:`, err);
          resolve(null);
        } else {
          resolve(row ? this._parseRow(row) : null);
        }
      });
    });
  }

  /**
   * FIND MANY - Get all matching records
   */
  findMany(table, criteria) {
    return new Promise((resolve, reject) => {
      const conditions = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(criteria);
      const sql = `SELECT * FROM ${table} WHERE ${conditions}`;
      
      this.db.all(sql, values, (err, rows) => {
        if (err) {
          console.error(`Error finding many in ${table}:`, err);
          resolve([]);
        } else {
          resolve((rows || []).map(row => this._parseRow(row)));
        }
      });
    });
  }

  /**
   * UPDATE - Update existing record
   */
  update(table, id, updates) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      updates.updatedAt = now;

      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates).map(val => 
        (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val
      );
      values.push(id);

      const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
      
      this.db.run(sql, values, (err) => {
        if (err) {
          console.error(`Error updating ${table}:`, err);
          resolve(null);
        } else {
          this.findById(table, id).then(resolve);
        }
      });
    });
  }

  /**
   * DELETE - Remove record
   */
  delete(table, id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${table} WHERE id = ?`;
      
      this.db.run(sql, [id], function(err) {
        if (err) {
          console.error(`Error deleting from ${table}:`, err);
          resolve(false);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * SEARCH - Find records by text search
   */
  search(table, searchTerm) {
    return new Promise((resolve, reject) => {
      const term = `%${searchTerm}%`;
      const sql = `SELECT * FROM ${table} WHERE title LIKE ? OR description LIKE ? OR content LIKE ?`;
      
      this.db.all(sql, [term, term, term], (err, rows) => {
        if (err) {
          console.error(`Error searching in ${table}:`, err);
          resolve([]);
        } else {
          resolve((rows || []).map(row => this._parseRow(row)));
        }
      });
    });
  }

  /**
   * COUNT - Count records matching criteria
   */
  count(table, criteria = {}) {
    return new Promise((resolve, reject) => {
      if (Object.keys(criteria).length === 0) {
        const sql = `SELECT COUNT(*) as count FROM ${table}`;
        this.db.get(sql, (err, result) => {
          if (err) {
            console.error(`Error counting in ${table}:`, err);
            resolve(0);
          } else {
            resolve(result.count);
          }
        });
      } else {
        const conditions = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(criteria);
        const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${conditions}`;
        
        this.db.get(sql, values, (err, result) => {
          if (err) {
            console.error(`Error counting in ${table}:`, err);
            resolve(0);
          } else {
            resolve(result.count);
          }
        });
      }
    });
  }

  /**
   * RUN - Execute raw SQL query
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error executing SQL:', err);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * CLEAR - Remove all records from table
   */
  clear(table) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${table}`;
      
      this.db.run(sql, (err) => {
        if (err) {
          console.error(`Error clearing ${table}:`, err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Parse row from database (handle JSON fields)
   */
  _parseRow(row) {
    if (!row) return row;
    const parsed = { ...row };
    // Handle potential JSON fields
    ['tags', 'certifications', 'changes'].forEach(field => {
      if (parsed[field] && typeof parsed[field] === 'string' && parsed[field].startsWith('[')) {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });
    return parsed;
  }

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = SQLiteDatabase;
