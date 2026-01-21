const SQLiteDatabase = require('./database');

const db = new SQLiteDatabase('./dkn.db');
const email = process.argv[2];

if (!email) {
  console.error('Usage: node delete-user.js <email>');
  console.error('Example: node delete-user.js john@example.com');
  process.exit(1);
}

setTimeout(async () => {
  try {
    console.log(`\nSearching for user: ${email}\n`);
    
    // Find user
    const user = await db.findOne('users', { email });
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      await db.close();
      process.exit(1);
    }

    // Prevent deleting admin
    if (user.role === 'Admin') {
      console.error('❌ Cannot delete Admin user!');
      await db.close();
      process.exit(1);
    }

    console.log(`Found user:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}\n`);

    // Delete from leaderboard
    await db.run('DELETE FROM leaderboard WHERE userId = ?', [user.id]);
    console.log(`✓ Deleted leaderboard entries`);

    // Delete user
    const deleted = await db.delete('users', user.id);
    
    if (deleted) {
      console.log(`✓ Deleted user from database\n`);
      console.log(`✅ User successfully deleted!\n`);
    } else {
      console.error('❌ Failed to delete user');
    }

    await db.close();
  } catch (err) {
    console.error('Error:', err.message);
    await db.close();
    process.exit(1);
  }
}, 1000);
