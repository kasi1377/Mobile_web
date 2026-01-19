const Database = require('./database.js');
const db = new Database('./dkn.db');

async function checkDB() {
  const users = await db.findAll('users');
  console.log('\n=== USERS TABLE ===');
  console.log('Total:', users.length);
  users.forEach(u => console.log(`- ${u.email} (${u.role})`));
  
  const consultants = await db.findAll('consultants');
  console.log('\n=== CONSULTANTS TABLE ===');
  console.log('Total:', consultants.length);
  consultants.forEach(c => console.log(`- ${c.email} (${c.role})`));
  
  await db.close();
}

checkDB();
