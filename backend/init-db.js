const SQLiteDatabase = require('./database');
const bcrypt = require('bcryptjs');

const db = new SQLiteDatabase('./dkn.db');

console.log('Initializing Velion Dynamics DKN Database (SQLite)...\n');

// Make main function async
(async () => {
  try {
    // ========== NEVER DELETE USER DATA ==========
    // This script will only add missing data, never delete existing data

    // ========== Users Table ==========
    console.log('Checking users...');

    // Only add admin if it doesn't exist
    const existingAdmin = await db.findById('users', 'admin-001');
    
    if (!existingAdmin) {
      const adminUser = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@veliondynamics.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'Admin',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.insert('users', adminUser);
      console.log('✓ Created admin user\n');
    } else {
      console.log('✓ Admin user already exists\n');
    }

    // ========== ConsultantType (Consultants) ==========
    console.log('Preserving existing consultants...\n');

    // ========== KnowledgeAssetType ==========
    console.log('Preserving existing knowledge assets...\n');

    // ========== TrainingModuleType ==========
    console.log('Checking training modules...');

    const trainings = [
      {
        id: 'train-001',
        title: 'Introduction to Cloud Migration',
        content: 'Learn the fundamentals of cloud migration strategies, including lift-and-shift, re-platforming, and refactoring approaches. This module covers AWS, Azure, and GCP best practices.',
        duration: '45 mins',
        completedBy: JSON.stringify([])
      },
      {
        id: 'train-002',
        title: 'Agile Project Management Essentials',
        content: 'Master Agile methodologies including Scrum, Kanban, and SAFe. Understand sprint planning, daily standups, retrospectives, and delivering value iteratively.',
        duration: '60 mins',
        completedBy: JSON.stringify([])
      },
      {
        id: 'train-003',
        title: 'Data Security & Compliance',
        content: 'Deep dive into GDPR, HIPAA, and SOC 2 compliance requirements. Learn data encryption, access controls, audit trails, and incident response procedures.',
        duration: '90 mins',
        completedBy: JSON.stringify([])
      },
      {
        id: 'train-004',
        title: 'Digital Transformation Strategy',
        content: 'Explore how to lead successful digital transformation initiatives. Topics include change management, stakeholder engagement, technology selection, and measuring ROI.',
        duration: '75 mins',
        completedBy: JSON.stringify([])
      },
      {
        id: 'train-005',
        title: 'API Design & Microservices',
        content: 'Learn RESTful API design principles, GraphQL, microservices architecture patterns, service mesh, and containerization with Docker and Kubernetes.',
        duration: '120 mins',
        completedBy: JSON.stringify([])
      }
    ];

    let addedCount = 0;
    for (const training of trainings) {
      const existing = await db.findById('trainings', training.id);
      if (!existing) {
        await db.insert('trainings', training);
        addedCount++;
      }
    }
    
    if (addedCount > 0) {
      console.log(`✓ Added ${addedCount} new training module(s)\n`);
    } else {
      console.log('✓ All training modules already exist\n');
    }

    // ========== Leaderboard Entries ==========
    console.log('Preserving existing leaderboard...\n');

    // ========== Audit Entries ==========
    console.log('Preserving existing audit entries...\n');

    console.log('✅ Database initialized successfully with SQLite!\n');
    console.log('Demo Login Credentials:');
    console.log('=' .repeat(50));
    console.log('🔐 ADMIN (Full System Access):');
    console.log('  Email: admin@veliondynamics.com');
    console.log('  Password: admin123\n');
    console.log('=' .repeat(50));
    console.log('\nDatabase file: dkn.db (SQLite)');
    console.log('\n✅ ALL EXISTING DATA PRESERVED - No data was deleted!');
    console.log('✨ You can now signup/login with your accounts safely.');

    await db.close();
  } catch (err) {
    console.error('Error initializing database:', err);
    await db.close();
    process.exit(1);
  }
})();
