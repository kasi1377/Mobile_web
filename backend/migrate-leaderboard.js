const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, './dkn.db');
const db = new sqlite3.Database(dbPath);

function getColumns(table) {
  return new Promise((resolve) => {
    db.all(`PRAGMA table_info(${table});`, (err, rows) => {
      if (err) return resolve([]);
      resolve(rows.map(r => r.name));
    });
  });
}

function addUserIdColumnIfMissing() {
  return new Promise(async (resolve, reject) => {
    const cols = await getColumns('leaderboard');
    if (!cols.includes('userId')) {
      db.run('ALTER TABLE leaderboard ADD COLUMN userId TEXT;', [], async (err) => {
        if (err) return reject(err);
        db.run('UPDATE leaderboard SET userId = consultantId WHERE userId IS NULL;', [], (err2) => {
          if (err2) return reject(err2);
          resolve();
        });
      });
    } else {
      resolve();
    }
  });
}

(async () => {
  try {
    console.log('Starting leaderboard migration...');
    await addUserIdColumnIfMissing();
    console.log('✓ Migration complete: leaderboard.userId populated from consultantId');
    db.close();
  } catch (e) {
    console.error('Migration failed:', e);
    db.close();
    process.exit(1);
  }
})();
