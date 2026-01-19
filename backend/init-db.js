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
      },
      {
        id: 'consultant-001',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Senior Consultant',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'consultant-002',
        name: 'James Chen',
        email: 'james.chen@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Consultant',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'consultant-003',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Knowledge Champion',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'consultant-004',
        name: 'Alex Kumar',
        email: 'alex.kumar@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Junior Consultant',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'consultant-005',
        name: 'David Thompson',
        email: 'david.thompson@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Reviewer',
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const user of users) {
      await db.insert('users', user);
    }
    console.log(`✓ Created ${users.length} users\n`);

    // ========== ConsultantType (Consultants) ==========
    console.log('Creating consultants...');

    const consultants = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@veliondynamics.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'Admin',
        department: 'Management',
        yearsOfExperience: 15,
        points: 500,
        contributions: 20
      },
      {
        id: 'consultant-001',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Senior Consultant',
        department: 'Digital Transformation',
        yearsOfExperience: 12,
        points: 450,
        contributions: 12
      },
      {
        id: 'consultant-002',
        name: 'James Chen',
        email: 'james.chen@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Consultant',
        department: 'Data Analytics',
        yearsOfExperience: 8,
        points: 290,
        contributions: 7
      },
      {
        id: 'consultant-003',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Knowledge Champion',
        department: 'Knowledge Management',
        yearsOfExperience: 10,
        points: 380,
        contributions: 9
      },
      {
        id: 'consultant-004',
        name: 'Alex Kumar',
        email: 'alex.kumar@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Junior Consultant',
        department: 'Development',
        yearsOfExperience: 3,
        points: 150,
        contributions: 3
      },
      {
        id: 'consultant-005',
        name: 'David Thompson',
        email: 'david.thompson@veliondynamics.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'Reviewer',
        department: 'Quality Assurance',
        yearsOfExperience: 11,
        points: 420,
        contributions: 15
      }
    ];

    for (const consultant of consultants) {
      await db.insert('consultants', consultant);
    }
    console.log(`✓ Created ${consultants.length} consultants\n`);

    // ========== KnowledgeAssetType ==========
    console.log('Creating knowledge assets...');

    const knowledgeAssets = [
      {
        id: 'asset-001',
        title: 'Digital Transformation Roadmap for Manufacturing',
        description: 'Comprehensive framework for implementing digital transformation',
        category: 'Framework',
        content: 'This framework provides step-by-step guidance for digital transformation...',
        author: 'Sarah Mitchell',
        authorId: 'consultant-001',
        status: 'approved',
        reviewStatus: 'approved',
        reviewedBy: 'consultant-003',
        reviewComments: 'Excellent framework with practical steps.',
        tags: ['digital-transformation', 'manufacturing', 'framework']
      },
      {
        id: 'asset-002',
        title: 'Cloud Migration Best Practices Guide',
        description: 'Step-by-step guide for migrating to cloud infrastructure',
        category: 'Guide',
        content: 'Cloud migration requires careful planning and execution...',
        author: 'Sarah Mitchell',
        authorId: 'consultant-001',
        status: 'approved',
        reviewStatus: 'approved',
        reviewedBy: 'consultant-003',
        reviewComments: 'Well-structured guide with clear strategies.',
        tags: ['cloud', 'migration', 'AWS']
      },
      {
        id: 'asset-003',
        title: 'AI Integration Template for Logistics',
        description: 'Template for integrating AI solutions in logistics',
        category: 'Template',
        content: 'This template provides a structure for AI implementation...',
        author: 'James Chen',
        authorId: 'consultant-002',
        status: 'pending',
        reviewStatus: 'pending',
        reviewedBy: null,
        reviewComments: null,
        tags: ['AI', 'logistics', 'automation']
      },
      {
        id: 'asset-004',
        title: 'Renewable Energy Project Proposal Template',
        description: 'Standardized template for renewable energy proposals',
        category: 'Template',
        content: 'Use this template for proposing renewable energy projects...',
        author: 'Alex Kumar',
        authorId: 'consultant-004',
        status: 'pending',
        reviewStatus: 'pending',
        reviewedBy: null,
        reviewComments: null,
        tags: ['renewable-energy', 'proposal', 'template']
      }
    ];

    for (const asset of knowledgeAssets) {
      await db.insert('knowledgeAssets', asset);
    }
    console.log(`✓ Created ${knowledgeAssets.length} knowledge assets\n`);

    // ========== TrainingModuleType ==========
    console.log('Creating training modules...');

    const trainings = [
      {
        id: 'training-001',
        title: 'Introduction to Digital Knowledge Network',
        description: 'Complete onboarding guide for using the DKN system',
        content: 'Welcome to DKN. This training covers the basics...',
        instructor: 'Admin User',
        duration: 120,
        level: 'Beginner',
        status: 'published',
        tags: ['onboarding', 'DKN', 'introduction']
      },
      {
        id: 'training-002',
        title: 'Advanced Knowledge Contribution',
        description: 'Best practices for contributing high-quality assets',
        content: 'This course covers advanced contribution strategies...',
        instructor: 'Sarah Mitchell',
        duration: 180,
        level: 'Advanced',
        status: 'published',
        tags: ['contribution', 'best-practices', 'advanced']
      },
      {
        id: 'training-003',
        title: 'AI-Powered Search Techniques',
        description: 'Leveraging AI recommendations effectively',
        content: 'Learn how to use AI features in DKN...',
        instructor: 'James Chen',
        duration: 90,
        level: 'Intermediate',
        status: 'published',
        tags: ['AI', 'search', 'recommendations']
      }
    ];

    for (const training of trainings) {
      await db.insert('trainings', training);
    }
    console.log(`✓ Created ${trainings.length} training modules\n`);

    // ========== Leaderboard Entries ==========
    console.log('Creating leaderboard entries...');

    const leaderboard = [
      {
        id: 'lead-001',
        consultantId: 'consultant-001',
        name: 'Sarah Mitchell',
        role: 'Senior Consultant',
        points: 450,
        submissions: 12,
        reviews: 8,
        rank: 1
      },
      {
        id: 'lead-002',
        consultantId: 'consultant-003',
        name: 'Maria Rodriguez',
        role: 'Knowledge Champion',
        points: 380,
        submissions: 9,
        reviews: 10,
        rank: 2
      },
      {
        id: 'lead-003',
        consultantId: 'consultant-002',
        name: 'James Chen',
        role: 'Consultant',
        points: 290,
        submissions: 7,
        reviews: 5,
        rank: 3
      },
      {
        id: 'lead-004',
        consultantId: 'consultant-005',
        name: 'David Thompson',
        role: 'Reviewer',
        points: 420,
        submissions: 15,
        reviews: 20,
        rank: 4
      }
    ];

    for (const entry of leaderboard) {
      await db.insert('leaderboard', entry);
    }
    console.log(`✓ Created ${leaderboard.length} leaderboard entries\n`);

    // ========== Audit Entries ==========
    console.log('Creating audit entries...');

    const auditEntries = [
      {
        id: 'audit-001',
        action: 'created',
        userId: 'consultant-001',
        userName: 'Sarah Mitchell',
        targetType: 'knowledgeAsset',
        targetId: 'asset-001',
        changes: 'Initial creation',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'audit-002',
        action: 'approved',
        userId: 'consultant-003',
        userName: 'Maria Rodriguez',
        targetType: 'knowledgeAsset',
        targetId: 'asset-001',
        changes: 'Status changed to approved',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'audit-003',
        action: 'created',
        userId: 'consultant-001',
        userName: 'Sarah Mitchell',
        targetType: 'knowledgeAsset',
        targetId: 'asset-002',
        changes: 'Initial creation',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const entry of auditEntries) {
      await db.insert('auditEntries', entry);
    }
    console.log(`✓ Created ${auditEntries.length} audit entries\n`);

    console.log('✅ Database initialized successfully with SQLite!\n');
    console.log('Demo Login Credentials:');
    console.log('=' .repeat(50));
    console.log('🔐 ADMIN (Full System Access):');
    console.log('  Email: admin@veliondynamics.com');
    console.log('  Password: admin123\n');
    console.log('👁️ REVIEWER (Only Review Tab):');
    console.log('  Email: david.thompson@veliondynamics.com');
    console.log('  Password: password123\n');
    console.log('👤 Senior Consultant (Can see all tabs except Admin/Review):');
    console.log('  Email: sarah.mitchell@veliondynamics.com');
    console.log('  Password: password123\n');
    console.log('👤 Knowledge Champion (Can see all tabs except Admin/Review):');
    console.log('  Email: maria.rodriguez@veliondynamics.com');
    console.log('  Password: password123\n');
    console.log('👤 Consultant (Can see Dashboard, Repository, Leaderboard, Training, AI Insights):');
    console.log('  Email: james.chen@veliondynamics.com');
    console.log('  Password: password123\n');
    console.log('👤 Junior Consultant (Can see Dashboard, Repository, Leaderboard, Training, AI Insights):');
    console.log('  Email: alex.kumar@veliondynamics.com');
    console.log('  Password: password123\n');
    console.log('=' .repeat(50));
    console.log('\nDatabase file: dkn.db (SQLite)');

    await db.close();
  } catch (err) {
    console.error('Error initializing database:', err);
    await db.close();
    process.exit(1);
  }
})();
