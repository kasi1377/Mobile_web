const Database = require('./database.js');
const db = new Database('./dkn.db');

async function checkUsers() {
  const users = await db.findAll('users');
  console.log('\n=== ALL USERS ===');
  console.log(JSON.stringify(users, null, 2));
  await db.close();
}

checkUsers();
