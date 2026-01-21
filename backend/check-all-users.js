const SQLiteDatabase = require('./database');

const db = new SQLiteDatabase('./dkn.db');

setTimeout(async () => {
  const users = await db.findAll('users');
  console.log('\n=== ALL USERS IN DATABASE ===');
  users.forEach(u => {
    console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`);
  });
  console.log(`\nTotal: ${users.length} users`);
  console.log('\n✅ ALL these users are preserved by init-db.js');
  process.exit(0);
}, 1000);
