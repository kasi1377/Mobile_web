const SQLiteDatabase = require('./database');

const db = new SQLiteDatabase('./dkn.db');

setTimeout(async () => {
  try {
    console.log('\n=== Checking Database ===\n');
    
    const users = await db.findAll('users');
    console.log(`Total Users: ${users.length}`);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    const leaderboard = await db.findAll('leaderboard');
    console.log(`\nTotal Leaderboard Entries: ${leaderboard.length}`);
    console.log('Leaderboard:', JSON.stringify(leaderboard, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.close();
  }
}, 1000);
