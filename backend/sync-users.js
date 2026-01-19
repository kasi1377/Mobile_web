const Database = require('./database.js');
const db = new Database('./dkn.db');

async function syncUsers() {
  // Get all consultants
  const consultants = await db.findAll('consultants');
  console.log('Consultants:', consultants.length);
  
  // Get all users
  const users = await db.findAll('users');
  console.log('Users:', users.length);
  
  // Find consultants not in users table
  for (const consultant of consultants) {
    const existingUser = users.find(u => u.id === consultant.id);
    if (!existingUser) {
      console.log('Adding to users table:', consultant.email);
      await db.insert('users', {
        id: consultant.id,
        name: consultant.name,
        email: consultant.email,
        password: consultant.password,
        role: consultant.role,
        isActive: 1
      });
    }
  }
  
  console.log('✅ Sync complete! All consultants are now in users table.');
  await db.close();
}

syncUsers().catch(console.error);
