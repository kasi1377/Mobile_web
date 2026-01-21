const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SQLiteDatabase = require('./database');

const app = express();
const db = new SQLiteDatabase('./dkn.db');
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'velion-dkn-secret-2025';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Auth: login attempt', { email });

    if (!email || !password) {
      console.warn('Auth: missing email/password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.findOne('users', { email });

    if (!user) {
      console.warn('Auth: user not found', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Auth: password check', { email, validPassword });

    if (!validPassword) {
      console.warn('Auth: invalid password', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    console.log('Auth: login success', { userId: user.id, email: user.email, role: user.role });
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Auth: login error', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role, expertise, region } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await db.findOne('users', { email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in users table only
    const newUser = await db.insert('users', {
      name,
      email,
      password: hashedPassword,
      role: role || 'Consultant',
      isActive: 1
    });

    // Create leaderboard entry
    await db.insert('leaderboard', {
      userId: newUser.id,
      name: newUser.name,
      role: newUser.role,
      points: 0,
      submissions: 0,
      reviews: 0,
      rank: await db.count('leaderboard') + 1
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await db.findById('users', req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ==================== KNOWLEDGE ASSETS ROUTES ====================

// Get all knowledge assets
app.get('/api/knowledge-assets', authenticateToken, async (req, res) => {
  const assets = await db.findAll('knowledgeAssets');
  res.json(assets);
});

// Get single knowledge asset
app.get('/api/knowledge-assets/:id', authenticateToken, async (req, res) => {
  const asset = await db.findById('knowledgeAssets', req.params.id);
  
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  res.json(asset);
});

// Create knowledge asset
app.post('/api/knowledge-assets', authenticateToken, async (req, res) => {
  try {
    const { title, contentType, description, tags, region } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newAsset = await db.insert('knowledgeAssets', {
      title,
      description,
      category: contentType || 'Document',
      content: description,
      author: req.user.name,
      authorId: req.user.id,
      status: 'pending',
      reviewStatus: 'pending',
      reviewedBy: null,
      reviewComments: null,
      tags: tags ? JSON.stringify(tags) : '[]',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update leaderboard submissions only
    await db.run(`
      UPDATE leaderboard SET submissions = submissions + 1 WHERE userId = ?
    `, [req.user.id]);

    // Create audit entry
    await db.insert('auditEntries', {
      action: 'created',
      userId: req.user.id,
      userName: req.user.name,
      targetType: 'knowledgeAsset',
      targetId: newAsset.id,
      changes: JSON.stringify({ title, category: contentType }),
      timestamp: new Date().toISOString()
    });

    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// Update knowledge asset
app.put('/api/knowledge-assets/:id', authenticateToken, async (req, res) => {
  const asset = await db.update('knowledgeAssets', req.params.id, {
    ...req.body,
    lastUpdated: new Date().toISOString()
  });

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Create audit entry
  await db.insert('auditEntries', {
    entryID: `AE-${Date.now()}`,
    assetID: asset.id,
    action: 'updated',
    timestamp: new Date().toISOString(),
    performedBy: req.user.id
  });

  res.json(asset);
});

// Review/Approve knowledge asset
app.post('/api/knowledge-assets/:id/review', authenticateToken, async (req, res) => {
  try {
    const { status, reviewComments } = req.body;
    
    const asset = await db.findById('knowledgeAssets', req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check if user is a reviewer
    const user = await db.findById('users', req.user.id);
    if (user.role !== 'Knowledge Champion' && user.role !== 'Senior Consultant' && user.role !== 'Reviewer') {
      return res.status(403).json({ error: 'Only Reviewers, Knowledge Champions and Senior Consultants can review assets' });
    }

    const updatedAsset = await db.update('knowledgeAssets', req.params.id, {
      status: status,
      reviewStatus: status === 'approved' ? 'approved' : 'rejected',
      reviewedBy: req.user.name,
      reviewComments: reviewComments,
      updatedAt: new Date().toISOString()
    });

    // Create audit entry
    await db.insert('auditEntries', {
      action: status === 'approved' ? 'approved' : 'rejected',
      userId: req.user.id,
      userName: req.user.name,
      targetType: 'knowledgeAsset',
      targetId: updatedAsset.id,
      changes: JSON.stringify({ status, reviewComments }),
      timestamp: new Date().toISOString()
    });

    // Update leaderboard if approved
    if (status === 'approved') {
      const creatorLeaderboard = await db.findOne('leaderboard', { userId: asset.authorId });
      if (creatorLeaderboard) {
        await db.run(`
          UPDATE leaderboard 
          SET points = points + 50, reviews = reviews + 1 
          WHERE userId = ?
        `, [asset.authorId]);
        
        // Points are tracked via leaderboard; no consultants table update
      }
    }

    res.json(updatedAsset);
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to review asset' });
  }
});

// Get pending assets for review
app.get('/api/knowledge-assets/pending/review', authenticateToken, async (req, res) => {
  const assets = await db.findMany('knowledgeAssets', { status: 'pending' });
  res.json(assets);
});

// Get user's submitted assets
app.get('/api/knowledge-assets/my/submissions', authenticateToken, async (req, res) => {
  const assets = await db.findMany('knowledgeAssets', { authorId: req.user.id });
  res.json(assets);
});

// Search knowledge assets
app.get('/api/knowledge-assets/search/:term', authenticateToken, async (req, res) => {
  const results = await db.search('knowledgeAssets', req.params.term);
  res.json(results);
});

// Delete knowledge asset
app.delete('/api/knowledge-assets/:id', authenticateToken, async (req, res) => {
  const success = db.delete('knowledgeAssets', req.params.id);
  
  if (!success) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Create audit entry
  await db.insert('auditEntries', {
    entryID: `AE-${Date.now()}`,
    assetID: req.params.id,
    action: 'deleted',
    timestamp: new Date().toISOString(),
    performedBy: req.user.id
  });

  res.json({ message: 'Asset deleted successfully' });
});

// ==================== USER ROUTES ====================
// Consultants endpoints removed; using Users exclusively

// ==================== LEADERBOARD ROUTES ====================

// Get leaderboard
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  const entries = await db.findAll('leaderboard');
  const sortedEntries = entries.sort((a, b) => b.points - a.points);
  
  const leaderboard = [];
  for (let index = 0; index < sortedEntries.length; index++) {
    const entry = sortedEntries[index];
    const user = await db.findById('users', entry.userId);
    leaderboard.push({
      ...entry,
      rank: index + 1,
      userName: user ? user.name : 'Unknown',
      userRole: user ? user.role : 'Unknown'
    });
  }
  
  res.json(leaderboard);
});

// ==================== TRAINING ROUTES ====================

// Get all trainings
app.get('/api/trainings', authenticateToken, async (req, res) => {
  const trainings = db.findAll('trainings');
  res.json(trainings);
});

// Complete training
app.post('/api/trainings/:id/complete', authenticateToken, async (req, res) => {
  const training = db.findById('trainings', req.params.id);
  
  if (!training) {
    return res.status(404).json({ error: 'Training not found' });
  }

  const completedBy = training.completedBy || [];
  
  if (!completedBy.includes(req.user.id)) {
    completedBy.push(req.user.id);
    
    const updated = await db.update('trainings', req.params.id, { completedBy });
    
    // Award points
    const leaderboard = await db.findOne('leaderboard', { userId: req.user.id });
    if (leaderboard) {
      await db.update('leaderboard', leaderboard.id, {
        points: (leaderboard.points || 0) + 10
      });
    }
    
    return res.json(updated);
  }

  res.json(training);
});

// ==================== AI RECOMMENDATIONS ROUTES ====================

// Get AI recommendations for assets
app.get('/api/recommendations/assets', authenticateToken, async (req, res) => {
  const user = await db.findById('users', req.user.id);
  const allAssets = await db.findMany('knowledgeAssets', { status: 'approved' });
  
  // Placeholder: return latest approved assets (no expertise field on users)
  const recommended = (allAssets || []).slice(0, 5);
  
  res.json(recommended);
});

// Get AI recommendations for experts
app.get('/api/recommendations/experts', authenticateToken, async (req, res) => {
  const user = await db.findById('consultants', req.user.id);
  const allConsultants = db.findAll('consultants')
    .filter(c => c.id !== req.user.id)
    .map(({ password, ...user }) => user);
  
  // Recommend experts with similar or complementary expertise
  const recommended = allConsultants.filter(consultant => {
    return consultant.expertise.some(exp => 
      user.expertise.some(userExp => 
        exp.toLowerCase().includes(userExp.toLowerCase())
      )
    );
  }).slice(0, 5);
  
  res.json(recommended);
});

// ==================== AUDIT ROUTES ====================

// Get audit logs
app.get('/api/audit-logs', authenticateToken, async (req, res) => {
  const logs = db.findAll('auditEntries')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
  
  res.json(logs);
});

// ==================== ADMIN ROUTES ====================

// Get all documents for admin review
app.get('/api/admin/documents', authenticateToken, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Only admins can access this resource' });
  }

  const assets = await db.findAll('knowledgeAssets');
  const users = await db.findAll('users');
  
  // Add creator name from users by authorId
  const assetsWithCreator = assets.map(asset => {
    const creator = users.find(u => u.id === asset.authorId);
    return {
      ...asset,
      creatorName: creator ? creator.name : 'Unknown'
    };
  });

  res.json(assetsWithCreator);
});

// Admin approve document
app.post('/api/admin/documents/:id/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Only admins can approve documents' });
  }

  const { adminComments } = req.body;
  const asset = await db.findById('knowledgeAssets', req.params.id);

  if (!asset) {
    return res.status(404).json({ error: 'Document not found' });
  }

  asset.status = 'approved';
  asset.adminApproved = true;
  asset.adminComments = adminComments || '';
  asset.adminReviewDate = new Date().toISOString();
  asset.adminReviewedBy = req.user.id;

  await db.update('knowledgeAssets', req.params.id, asset);

  // Log audit entry
  await db.insert('auditEntries', {
    userID: req.user.id,
    action: 'Admin Approved Document',
    documentID: req.params.id,
    timestamp: new Date().toISOString(),
    details: `Admin approved document: ${asset.title}`
  });

  res.json({ message: 'Document approved successfully', asset });
});

// Admin reject document
app.post('/api/admin/documents/:id/reject', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Only admins can reject documents' });
  }

  const { adminComments } = req.body;
  const asset = await db.findById('knowledgeAssets', req.params.id);

  if (!asset) {
    return res.status(404).json({ error: 'Document not found' });
  }

  if (!adminComments) {
    return res.status(400).json({ error: 'Rejection reason is required' });
  }

  asset.status = 'rejected';
  asset.adminApproved = false;
  asset.adminComments = adminComments;
  asset.adminReviewDate = new Date().toISOString();
  asset.adminReviewedBy = req.user.id;

  await db.update('knowledgeAssets', req.params.id, asset);

  // Log audit entry
  await db.insert('auditEntries', {
    userID: req.user.id,
    action: 'Admin Rejected Document',
    documentID: req.params.id,
    timestamp: new Date().toISOString(),
    details: `Admin rejected document: ${asset.title} - Reason: ${adminComments}`
  });

  res.json({ message: 'Document rejected successfully', asset });
});

// ==================== STATISTICS ROUTES ====================

// Get dashboard statistics
app.get('/api/statistics', authenticateToken, async (req, res) => {
  const allAssets = await db.findAll('knowledgeAssets');
  
  // Category distribution
  const categoryCount = {};
  allAssets.forEach(asset => {
    const cat = asset.category || asset.contentType || 'Unknown';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  // Top contributors
  const contributorCount = {};
  allAssets.forEach(asset => {
    if (asset.authorId) {
      contributorCount[asset.authorId] = (contributorCount[asset.authorId] || 0) + 1;
    }
  });
  
  const topContributors = Object.entries(contributorCount)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const stats = {
    totalAssets: await db.count('knowledgeAssets'),
    approvedAssets: await db.count('knowledgeAssets', { status: 'approved' }),
    pendingAssets: await db.count('knowledgeAssets', { status: 'pending' }),
    totalConsultants: await db.count('users'),
    totalTrainings: await db.count('trainings'),
    totalDownloads: 0,
    totalViews: 0,
    categoryDistribution: categoryCount,
    topContributors: topContributors
  };
  
  res.json(stats);
});

// ==================== ADMIN ROUTES ====================

// Get all database tables data (for admin panel)
app.get('/api/admin/database', async (req, res) => {
  try {
    const tables = {
      users: await db.findAll('users'),
      consultants: await db.findAll('consultants'),
      knowledgeAssets: await db.findAll('knowledgeAssets'),
      trainings: await db.findAll('trainings'),
      leaderboard: await db.findAll('leaderboard'),
      auditEntries: await db.findAll('auditEntries'),
      aiRecommendations: await db.findAll('aiRecommendations'),
      repository: await db.findAll('repository'),
      metadata: await db.findAll('metadata')
    };
    
    res.json(tables);
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch database data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ===============================================
   Velion Dynamics - Digital Knowledge Network
   Server running on http://localhost:${PORT}
  ===============================================
  `);
});
