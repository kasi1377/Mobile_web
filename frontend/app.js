const { useState, useEffect } = React;
const API_URL = 'http://localhost:3002/api';

// ============ API Service ============
const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  signup: async (userData) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getMe: async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getKnowledgeAssets: async (token) => {
    const res = await fetch(`${API_URL}/knowledge-assets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  createKnowledgeAsset: async (token, data) => {
    const res = await fetch(`${API_URL}/knowledge-assets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  reviewKnowledgeAsset: async (token, assetId, reviewData) => {
    const res = await fetch(`${API_URL}/knowledge-assets/${assetId}/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  getPendingAssets: async (token) => {
    const res = await fetch(`${API_URL}/knowledge-assets/pending/review`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getMySubmissions: async (token) => {
    const res = await fetch(`${API_URL}/knowledge-assets/my/submissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  searchAssets: async (token, term) => {
    const res = await fetch(`${API_URL}/knowledge-assets/search/${term}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getConsultants: async (token) => {
    const res = await fetch(`${API_URL}/consultants`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getLeaderboard: async (token) => {
    const res = await fetch(`${API_URL}/leaderboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getTrainings: async (token) => {
    const res = await fetch(`${API_URL}/trainings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  completeTraining: async (token, trainingId) => {
    const res = await fetch(`${API_URL}/trainings/${trainingId}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getStatistics: async (token) => {
    const res = await fetch(`${API_URL}/statistics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getAssetRecommendations: async (token) => {
    const res = await fetch(`${API_URL}/recommendations/assets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getExpertRecommendations: async (token) => {
    const res = await fetch(`${API_URL}/recommendations/experts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Admin Review APIs
  getAllDocumentsForReview: async (token) => {
    const res = await fetch(`${API_URL}/admin/documents`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  approveDocument: async (token, assetId, adminComments) => {
    const res = await fetch(`${API_URL}/admin/documents/${assetId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminComments })
    });
    return res.json();
  },

  rejectDocument: async (token, assetId, adminComments) => {
    const res = await fetch(`${API_URL}/admin/documents/${assetId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminComments })
    });
    return res.json();
  }
};

// ============ Auth Page Component ============
function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Consultant');
  const [signupRegion, setSignupRegion] = useState('Europe');
  const [signupExpertise, setSignupExpertise] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(loginEmail, loginPassword);
      
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.token, data.user);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole
      });
      
      if (data.error) {
        setError(data.error);
      } else {
        // Clear form
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupRole('Consultant');
        
        // Switch to login tab
        setActiveTab('login');
        setLoginEmail(signupEmail);
        setError('');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Velion Dynamics</h1>
          <p>Digital Knowledge Network</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-body">
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                >
                  <option>Junior Consultant</option>
                  <option>Consultant</option>
                  <option>Reviewer</option>
                  <option>Senior Consultant</option>
                  <option>Knowledge Champion</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Region</label>
                <select
                  className="form-select"
                  value={signupRegion}
                  onChange={(e) => setSignupRegion(e.target.value)}
                >
                  <option>Europe</option>
                  <option>Asia</option>
                  <option>North America</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expertise (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Cloud Computing, AI, Data Science"
                  value={signupExpertise}
                  onChange={(e) => setSignupExpertise(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Dashboard Component ============
function Dashboard({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await api.getStatistics(token);
    setStats(data);
  };

  if (!stats) return <div className="loading">Loading statistics...</div>;

  return (
    <div>
      <h2 className="card-title" style={{marginBottom: '1.5rem'}}>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Knowledge Assets</div>
          <div className="stat-value">{stats.totalAssets}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved Assets</div>
          <div className="stat-value">{stats.approvedAssets}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{stats.pendingAssets}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Consultants</div>
          <div className="stat-value">{stats.totalConsultants}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{stats.totalViews}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Downloads</div>
          <div className="stat-value">{stats.totalDownloads}</div>
        </div>
      </div>
    </div>
  );
}

// ============ Knowledge Repository Component ============
function KnowledgeRepository({ token, user }) {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    loadAssets();
  }, [viewMode]);

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      setFilteredAssets(assets);
    }
  }, [searchTerm, assets]);

  const loadAssets = async () => {
    try {
      let data;
      if (viewMode === 'my') {
        data = await api.getMySubmissions(token);
      } else {
        data = await api.getKnowledgeAssets(token);
      }
      setAssets(data);
      setFilteredAssets(data);
    } catch (err) {
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (searchTerm.length < 2) {
      setFilteredAssets(assets);
      return;
    }
    try {
      const data = await api.searchAssets(token, searchTerm);
      setFilteredAssets(data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const handleCreateAsset = async (formData) => {
    try {
      await api.createKnowledgeAsset(token, formData);
      setShowCreateForm(false);
      loadAssets();
    } catch (err) {
      console.error('Error creating asset:', err);
    }
  };

  if (loading) return <div className="loading">Loading knowledge assets...</div>;

  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">Knowledge Repository</h2>
        <div className="flex-row">
          <button 
            className="btn btn-secondary btn-small" 
            onClick={() => setViewMode(viewMode === 'all' ? 'my' : 'all')}
          >
            {viewMode === 'all' ? '📝 My Submissions' : '📚 All Assets'}
          </button>
          <button 
            className="btn btn-primary btn-small" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Upload Asset'}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <CreateAssetForm onSubmit={handleCreateAsset} onCancel={() => setShowCreateForm(false)} />
      )}

      {viewMode === 'all' && (
        <div style={{marginBottom: '1.5rem'}}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search knowledge assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div>
        {filteredAssets.length === 0 ? (
          <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
            {viewMode === 'my' ? 'You haven\'t submitted any assets yet' : 'No assets found'}
          </p>
        ) : (
          filteredAssets.map(asset => (
            <AssetCard key={asset.id} asset={asset} currentUser={user} />
          ))
        )}
      </div>
    </div>
  );
}

// ============ Create Asset Form Component ============
function CreateAssetForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('Document');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [region, setRegion] = useState('Europe');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      contentType,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      region
    });
  };

  return (
    <div className="card" style={{background: '#f8fafc', marginBottom: '1.5rem'}}>
      <h3 style={{marginBottom: '1rem'}}>Upload New Knowledge Asset</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content Type</label>
          <select className="form-select" value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option>Document</option>
            <option>Template</option>
            <option>Framework</option>
            <option>Checklist</option>
            <option>Guide</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., cloud, migration, AWS"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Region</label>
          <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>Europe</option>
            <option>Asia</option>
            <option>North America</option>
          </select>
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button type="submit" className="btn btn-primary btn-small">Upload Asset</button>
          <button type="button" className="btn btn-secondary btn-small" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ============ Asset Card Component ============
function AssetCard({ asset, currentUser }) {
  return (
    <div className="asset-card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <div style={{flex: 1}}>
          <h3 className="asset-title">{asset.title}</h3>
          <p style={{color: '#666', marginBottom: '0.75rem'}}>{asset.description}</p>
          
          <div className="asset-tags">
            {asset.tags?.map((tag, idx) => (
              <span key={idx} className="asset-tag">{tag}</span>
            ))}
          </div>

          <div className="asset-meta">
            <span>📄 {asset.contentType}</span>
            <span>🌍 {asset.region}</span>
            <span>👁 {asset.viewCount} views</span>
            <span>⬇ {asset.downloadCount} downloads</span>
          </div>

          {asset.status === 'approved' && asset.reviewComments && (
            <div style={{marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', borderLeft: '3px solid #22c55e'}}>
              <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#22c55e', marginBottom: '0.25rem'}}>
                ✓ Reviewed by Knowledge Champion
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>
                {asset.reviewComments}
              </div>
              <div style={{fontSize: '0.8rem', color: '#999', marginTop: '0.25rem'}}>
                {new Date(asset.reviewDate).toLocaleDateString()}
              </div>
            </div>
          )}

          {currentUser && asset.creatorID === currentUser.id && asset.status === 'pending' && (
            <div style={{marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '3px solid #f59e0b'}}>
              <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#f59e0b'}}>
                ⏳ Awaiting Review
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>
                Your submission is pending review by a Knowledge Champion.
              </div>
            </div>
          )}

          {asset.status === 'rejected' && asset.reviewComments && (
            <div style={{marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '3px solid #ef4444'}}>
              <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#ef4444', marginBottom: '0.25rem'}}>
                ✗ Review Feedback
              </div>
              <div style={{fontSize: '0.9rem', color: '#666'}}>
                {asset.reviewComments}
              </div>
            </div>
          )}
        </div>

        <div>
          <span className={`status-badge status-${asset.status}`}>
            {asset.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============ Review Management Component ============
function ReviewManagement({ token, user }) {
  const [pendingAssets, setPendingAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingAsset, setReviewingAsset] = useState(null);
  const [reviewComments, setReviewComments] = useState('');

  useEffect(() => {
    loadPendingAssets();
  }, []);

  const loadPendingAssets = async () => {
    try {
      const data = await api.getPendingAssets(token);
      setPendingAssets(data);
    } catch (err) {
      console.error('Error loading pending assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (assetId, status) => {
    try {
      await api.reviewKnowledgeAsset(token, assetId, {
        status,
        reviewComments
      });
      setReviewingAsset(null);
      setReviewComments('');
      loadPendingAssets();
      alert(`Asset ${status} successfully!`);
    } catch (err) {
      console.error('Error reviewing asset:', err);
      alert('Failed to review asset. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading pending reviews...</div>;

  const canReview = user.role === 'Reviewer';

  if (!canReview) {
    return (
      <div className="card">
        <h2 className="card-title">Review Management</h2>
        <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
          Only Reviewers can access the review section.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">📋 Pending Reviews</h2>
        <span className="status-badge status-pending">{pendingAssets.length} Pending</span>
      </div>

      {pendingAssets.length === 0 ? (
        <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
          No assets pending review
        </p>
      ) : (
        pendingAssets.map(asset => (
          <div key={asset.id} className="asset-card">
            <div className="flex-between">
              <div style={{flex: 1}}>
                <h3 className="asset-title">{asset.title}</h3>
                <p style={{color: '#666', marginBottom: '0.75rem'}}>{asset.description}</p>
                
                <div className="asset-tags">
                  {asset.tags?.map((tag, idx) => (
                    <span key={idx} className="asset-tag">{tag}</span>
                  ))}
                </div>

                <div className="asset-meta">
                  <span>📄 {asset.contentType}</span>
                  <span>🌍 {asset.region}</span>
                  <span>📅 {new Date(asset.createdDate).toLocaleDateString()}</span>
                </div>

                {reviewingAsset === asset.id && (
                  <div style={{marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px'}}>
                    <label className="form-label">Review Comments</label>
                    <textarea
                      className="form-input"
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Add your review comments..."
                      rows="3"
                    />
                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem'}}>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleReview(asset.id, 'approved')}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn btn-secondary btn-small"
                        style={{background: '#ef4444', color: 'white'}}
                        onClick={() => handleReview(asset.id, 'rejected')}
                      >
                        ✗ Reject
                      </button>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          setReviewingAsset(null);
                          setReviewComments('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {reviewingAsset !== asset.id && (
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => setReviewingAsset(asset.id)}
                >
                  Review
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============ Leaderboard Component ============
function Leaderboard({ token }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await api.getLeaderboard(token);
    setLeaderboard(data);
  };

  return (
    <div className="card">
      <h2 className="card-title" style={{marginBottom: '1.5rem'}}>🏆 Leaderboard</h2>
      {leaderboard.map((entry, idx) => (
        <div key={entry.id} className="asset-card leaderboard-entry">
          <div className="leaderboard-entry-medal">
            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
          </div>
          <div className="leaderboard-entry-info">
            <h3 className="leaderboard-entry-name">{entry.userName}</h3>
            <p className="leaderboard-entry-role">{entry.userRole}</p>
          </div>
          <div className="leaderboard-entry-score">
            <p className="leaderboard-entry-points">{entry.points} pts</p>
            <p className="leaderboard-entry-contributions">{entry.contributionCount} contributions</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ Training Component ============
function Training({ token, user }) {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    const data = await api.getTrainings(token);
    setTrainings(data);
  };

  const handleComplete = async (trainingId) => {
    await api.completeTraining(token, trainingId);
    loadTrainings();
    alert('Training completed! You earned 10 points.');
  };

  return (
    <div className="card">
      <h2 className="card-title" style={{marginBottom: '1.5rem'}}>📖 Training Modules</h2>
      {trainings.map(training => (
        <div key={training.id} className="asset-card">
          <h3 className="asset-title">{training.title}</h3>
          <p style={{color: '#666', marginBottom: '0.75rem'}}>{training.content}</p>
          <div className="training-header">
            <span className="training-duration">⏱ {training.duration}</span>
            {training.completedBy?.includes(user.id) ? (
              <span className="status-badge status-approved">✓ Completed</span>
            ) : (
              <button 
                className="btn btn-primary btn-small"
                onClick={() => handleComplete(training.id)}
              >
                Complete Training
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ AI Insights Component ============
function AIInsights({ token }) {
  const [assetRecs, setAssetRecs] = useState([]);
  const [expertRecs, setExpertRecs] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    const assets = await api.getAssetRecommendations(token);
    const experts = await api.getExpertRecommendations(token);
    setAssetRecs(assets);
    setExpertRecs(experts);
  };

  return (
    <div>
      <h2 className="card-title" style={{marginBottom: '1.5rem'}}>🤖 AI-Powered Insights</h2>
      
      <div className="card" style={{marginBottom: '1.5rem'}}>
        <h3 style={{marginBottom: '1rem'}}>Recommended Knowledge Assets</h3>
        {assetRecs.length === 0 ? (
          <p style={{color: '#999'}}>No recommendations available</p>
        ) : (
          assetRecs.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))
        )}
      </div>

      <div className="card">
        <h3 style={{marginBottom: '1rem'}}>Recommended Experts</h3>
        {expertRecs.length === 0 ? (
          <p style={{color: '#999'}}>No expert recommendations</p>
        ) : (
          expertRecs.map(expert => (
            <div key={expert.id} className="asset-card">
              <h3>{expert.name}</h3>
              <p style={{color: '#666', marginBottom: '0.5rem'}}>{expert.role}</p>
              <div className="asset-tags">
                {expert.expertise?.map((exp, idx) => (
                  <span key={idx} className="asset-tag">{exp}</span>
                ))}
              </div>
              <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#999'}}>
                🌍 {expert.region}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============ Admin Review Component (Admin Only) ============
function AdminReview({ token, user }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingDoc, setReviewingDoc] = useState(null);
  const [adminComments, setAdminComments] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await api.getAllDocumentsForReview(token);
      setDocuments(data);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (docId) => {
    try {
      await api.approveDocument(token, docId, adminComments);
      setReviewingDoc(null);
      setAdminComments('');
      loadDocuments();
      alert('Document approved successfully!');
    } catch (err) {
      console.error('Error approving document:', err);
      alert('Failed to approve document. Please try again.');
    }
  };

  const handleReject = async (docId) => {
    if (!adminComments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await api.rejectDocument(token, docId, adminComments);
      setReviewingDoc(null);
      setAdminComments('');
      loadDocuments();
      alert('Document rejected successfully!');
    } catch (err) {
      console.error('Error rejecting document:', err);
      alert('Failed to reject document. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading documents for review...</div>;

  const filteredDocuments = filterStatus === 'all' ? documents : documents.filter(d => d.status === filterStatus);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔐 Admin Document Review</h2>
          <div className="flex-row">
            <select 
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{minWidth: '150px'}}
            >
              <option value="all">All Documents</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="card">
          <p style={{textAlign: 'center', padding: '2rem', color: '#999'}}>
            No documents found with selected filter
          </p>
        </div>
      ) : (
        filteredDocuments.map(doc => (
          <div key={doc.id} className="card">
            <div className="card-header">
              <div style={{flex: 1}}>
                <h3 className="asset-title">{doc.title}</h3>
                <p style={{color: '#666', marginBottom: '0.75rem'}}>{doc.description}</p>
                
                <div className="asset-tags">
                  {doc.tags?.map((tag, idx) => (
                    <span key={idx} className="asset-tag">{tag}</span>
                  ))}
                </div>

                <div className="asset-meta">
                  <span>👤 Creator: {doc.creatorName || 'Unknown'}</span>
                  <span>📄 Type: {doc.contentType}</span>
                  <span>🌍 {doc.region}</span>
                  <span>📅 {new Date(doc.createdDate).toLocaleDateString()}</span>
                </div>

                {doc.status && (
                  <div style={{marginTop: '0.75rem'}}>
                    <span className={`status-badge status-${doc.status === 'approved' ? 'approved' : doc.status === 'rejected' ? 'rejected' : 'pending'}`}>
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                )}

                {reviewingDoc === doc.id && (
                  <div style={{marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px'}}>
                    <label className="form-label">Admin Comments & Decision</label>
                    <textarea
                      className="textarea-field"
                      placeholder="Provide detailed comments about this document review (required for rejection)..."
                      value={adminComments}
                      onChange={(e) => setAdminComments(e.target.value)}
                      style={{minHeight: '100px'}}
                    />
                    <div className="flex-row" style={{marginTop: '1rem', gap: '0.5rem'}}>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleApprove(doc.id)}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn"
                        onClick={() => handleReject(doc.id)}
                        style={{background: '#ef4444', color: 'white'}}
                      >
                        ✗ Reject
                      </button>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          setReviewingDoc(null);
                          setAdminComments('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {doc.status !== 'pending' && doc.adminComments && (
                  <div style={{marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px'}}>
                    <p style={{fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.5rem 0'}}>Admin Decision:</p>
                    <p style={{margin: 0, color: '#666'}}>{doc.adminComments}</p>
                  </div>
                )}
              </div>
            </div>

            {reviewingDoc !== doc.id && (
              <div style={{marginTop: '1rem'}}>
                {doc.status === 'pending' ? (
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => setReviewingDoc(doc.id)}
                  >
                    Review Document
                  </button>
                ) : (
                  <span style={{color: '#999', fontSize: '0.9rem'}}>
                    This document has already been {doc.status}
                  </span>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ============ Main App Component ============
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const canReview = user.role === 'Reviewer';

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-brand">Velion Dynamics</div>
        <div className="header-user">
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button className="btn btn-logout btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'repository' ? 'active' : ''}`}
          onClick={() => setActiveTab('repository')}
        >
          Repository
        </button>
        {canReview && (
          <button
            className={`nav-tab ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            ✓ Review
          </button>
        )}
        {user?.role === 'Admin' && (
          <button
            className={`nav-tab ${activeTab === 'admin-review' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-review')}
          >
            🔐 Admin Review
          </button>
        )}
        <button
          className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => setActiveTab('training')}
        >
          Training
        </button>
        <button
          className={`nav-tab ${activeTab === 'ai-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-insights')}
        >
          AI Insights
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard token={token} />}
        {activeTab === 'repository' && <KnowledgeRepository token={token} user={user} />}
        {activeTab === 'review' && <ReviewManagement token={token} user={user} />}
        {activeTab === 'admin-review' && user?.role === 'Admin' && <AdminReview token={token} user={user} />}
        {activeTab === 'leaderboard' && <Leaderboard token={token} />}
        {activeTab === 'training' && <Training token={token} user={user} />}
        {activeTab === 'ai-insights' && <AIInsights token={token} />}
      </main>
    </div>
  );
}

// ============ Render App ============
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
