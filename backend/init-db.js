const SQLiteDatabase = require('./database');
const bcrypt = require('bcryptjs');

const db = new SQLiteDatabase('./dkn.db');

console.log('Initializing Velion Dynamics DKN Database (SQLite)...\n');

// Make main function async
(async () => {
  try {
    // Clear existing data
    const tables = ['users', 'consultants', 'knowledgeAssets', 'metadata', 'repository', 
                    'auditEntries', 'trainings', 'leaderboard', 'aiRecommendations'];

    for (const table of tables) {
      await db.clear(table);
    }

    // ========== Users Table ==========
    console.log('Creating users...');

    const users = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@veliondynamics.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'Admin',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const user of users) {
      await db.insert('users', user);
    }
    console.log(`✓ Created ${users.length} user(s)\n`);

    // ========== ConsultantType (Consultants) ==========
    console.log('Creating consultants...');

    const consultants = [];

    for (const consultant of consultants) {
      await db.insert('consultants', consultant);
    }
    console.log(`✓ Created ${consultants.length} consultant(s)\n`);

    // ========== KnowledgeAssetType ==========
    console.log('Creating knowledge assets...');

    const knowledgeAssets = [];

    for (const asset of knowledgeAssets) {
      await db.insert('knowledgeAssets', asset);
    }
    console.log(`✓ Created ${knowledgeAssets.length} knowledge assets\n`);

    // ========== TrainingModuleType ==========
    console.log('Creating training modules...');

    const trainings = [];

    for (const training of trainings) {
      await db.insert('trainings', training);
    }
    console.log(`✓ Created ${trainings.length} training module(s)\n`);

    // ========== Leaderboard Entries ==========
    console.log('Creating leaderboard entries...');

    const leaderboard = [
      {
        id: 'lead-001',
        userId: 'admin-001',
        name: 'Admin User',
        role: 'Admin',
        points: 500,
        submissions: 20,
        reviews: 0,
        rank: 1
      }
    ];

    for (const entry of leaderboard) {
      await db.insert('leaderboard', entry);
    }
    console.log(`✓ Created ${leaderboard.length} leaderboard entry(s)\n`);

    // ========== Audit Entries ==========
    console.log('Creating audit entries...');

    const auditEntries = [];

    for (const entry of auditEntries) {
      await db.insert('auditEntries', entry);
    }
    console.log(`✓ Created ${auditEntries.length} audit entry(s)\n`);

    console.log('✅ Database initialized successfully with SQLite!\n');
    console.log('Demo Login Credentials:');
    console.log('=' .repeat(50));
    console.log('🔐 ADMIN (Full System Access):');
    console.log('  Email: admin@veliondynamics.com');
    console.log('  Password: admin123\n');
    console.log('=' .repeat(50));
    console.log('\nDatabase file: dkn.db (SQLite)');
    console.log('\n✨ All demo users deleted. You can now create new users via signup!');

    await db.close();
  } catch (err) {
    console.error('Error initializing database:', err);
    await db.close();
    process.exit(1);
  }
})();
