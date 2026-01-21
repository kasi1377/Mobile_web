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
      console.log('UI: login submit', { email: loginEmail });
      const data = await api.login(loginEmail, loginPassword);
      console.log('UI: login response', data);
      
      if (data.error) {
        console.warn('UI: login failed', data.error);
        setError(data.error);
      } else {
        console.log('UI: login success', { user: data.user });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.token, data.user);
      }
    } catch (err) {
      console.error('UI: login exception', err);
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
  const [recentAssets, setRecentAssets] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentAssets();
  }, []);

  const loadStats = async () => {
    const data = await api.getStatistics(token);
    setStats(data);
  };

  const loadRecentAssets = async () => {
    const data = await api.getKnowledgeAssets(token);
    setRecentAssets(data.slice(0, 5));
  };

  if (!stats) return <div className="loading">Loading statistics...</div>;

  // Calculate percentages for category distribution
  const totalAssets = stats.totalAssets || 1;
  const categoryData = Object.entries(stats.categoryDistribution || {}).map(([name, count]) => ({
    name,
    count,
    percentage: (count / totalAssets * 100).toFixed(1)
  })).sort((a, b) => b.count - a.count);

  // Colors for charts
  const categoryColors = {
    'Document': '#3b82f6',
    'Template': '#8b5cf6',
    'Framework': '#ec4899',
    'Checklist': '#10b981',
    'Guide': '#f59e0b'
  };

  const approvalRate = totalAssets > 0 ? ((stats.approvedAssets / totalAssets) * 100).toFixed(1) : 0;
  const pendingRate = totalAssets > 0 ? ((stats.pendingAssets / totalAssets) * 100).toFixed(1) : 0;

  return (
    <div>
      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{margin: 0, fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>
          📊 Analytics Dashboard
        </h1>
        <p style={{margin: 0, opacity: 0.9, fontSize: '1rem'}}>
          Real-time insights into your knowledge network
        </p>
      </div>
      
      {/* Enhanced Stats Grid with Icons and Gradients */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.2}}>📚</div>
          <div style={{fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, fontWeight: '500'}}>Total Assets</div>
          <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>{stats.totalAssets}</div>
          <div style={{fontSize: '0.85rem', opacity: 0.9}}>
            {stats.totalAssets > 0 ? '+' : ''}All knowledge items
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.2}}>✅</div>
          <div style={{fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, fontWeight: '500'}}>Approved</div>
          <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>{stats.approvedAssets}</div>
          <div style={{fontSize: '0.85rem', opacity: 0.9}}>
            {approvalRate}% approval rate
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.2}}>⏳</div>
          <div style={{fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, fontWeight: '500'}}>Pending Review</div>
          <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>{stats.pendingAssets}</div>
          <div style={{fontSize: '0.85rem', opacity: 0.9}}>
            {pendingRate}% awaiting review
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', opacity: 0.2}}>👥</div>
          <div style={{fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, fontWeight: '500'}}>Active Users</div>
          <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>{stats.totalConsultants}</div>
          <div style={{fontSize: '0.85rem', opacity: 0.9}}>
            Contributors active
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
        
        {/* Category Distribution with 3D Effect */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#1f2937'}}>
              🎯 Content Distribution
            </h3>
            <span style={{
              background: '#eff6ff',
              color: '#3b82f6',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {categoryData.length} Categories
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            {categoryData.map(({ name, count, percentage }, index) => (
              <div key={name} style={{position: 'relative'}}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  <span style={{fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: categoryColors[name] || '#6366f1',
                      display: 'inline-block'
                    }} />
                    {name}
                  </span>
                  <span style={{color: '#6b7280', fontWeight: '600'}}>
                    {count} items ({percentage}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${categoryColors[name] || '#6366f1'}, ${categoryColors[name] || '#6366f1'}dd)`,
                    transition: 'width 0.6s ease',
                    borderRadius: '6px',
                    boxShadow: `0 0 10px ${categoryColors[name] || '#6366f1'}44`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                      borderRadius: '6px'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Donut Chart */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{margin: 0, marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937'}}>
            📈 Asset Status
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'}}>
            {/* Donut Chart */}
            <div style={{position: 'relative', width: '180px', height: '180px'}}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(
                  #10b981 0% ${approvalRate}%,
                  #f59e0b ${approvalRate}% ${parseFloat(approvalRate) + parseFloat(pendingRate)}%,
                  #e5e7eb ${parseFloat(approvalRate) + parseFloat(pendingRate)}% 100%
                )`,
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#1f2937'}}>
                  {totalAssets}
                </div>
                <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: '600'}}>
                  TOTAL
                </div>
              </div>
            </div>
            
            {/* Legend with Stats */}
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #86efac'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#10b981'}} />
                  <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#065f46'}}>Approved</span>
                </div>
                <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#059669'}}>{stats.approvedAssets}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: '#fffbeb',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b'}} />
                  <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#92400e'}}>Pending</span>
                </div>
                <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#d97706'}}>{stats.pendingAssets}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Top Contributors and Recent Activity */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
        
        {/* Top Contributors with Rankings */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{margin: 0, marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937'}}>
            🏆 Top Contributors
          </h3>
          {stats.topContributors && stats.topContributors.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {stats.topContributors.map((contributor, index) => (
                <div key={contributor.userId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: index === 0 
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
                    : index === 1
                    ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                    : index === 2
                    ? 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
                    : '#fafafa',
                  borderRadius: '10px',
                  border: index === 0 ? '2px solid #f59e0b' : index < 3 ? '2px solid #d1d5db' : '1px solid #e5e7eb',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: index < 3 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: index === 0 
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                        : index === 1
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                        : index === 2
                        ? 'linear-gradient(135deg, #fb923c, #ea580c)'
                        : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}>
                      #{index + 1}
                    </div>
                    <div>
                      <div style={{fontWeight: '600', fontSize: '1rem', color: '#1f2937'}}>
                        User {contributor.userId.substring(0, 8)}
                      </div>
                      <div style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem'}}>
                        <strong>{contributor.count}</strong> contribution{contributor.count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{fontSize: '2rem'}}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && '⭐'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#9ca3af',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>🎯</div>
              <div>No contributions yet</div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{margin: 0, marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937'}}>
            ⚡ Recent Activity
          </h3>
          {recentAssets.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {recentAssets.map((asset, index) => (
                <div key={asset.id} style={{
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${categoryColors[asset.category] || '#6366f1'}`,
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '0.9rem', color: '#1f2937', marginBottom: '0.25rem'}}>
                        {asset.title}
                      </div>
                      <div style={{fontSize: '0.8rem', color: '#6b7280'}}>
                        {asset.category || asset.contentType} • {new Date(asset.createdAt || asset.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      background: asset.status === 'approved' ? '#d1fae5' : '#fef3c7',
                      color: asset.status === 'approved' ? '#065f46' : '#92400e'
                    }}>
                      {asset.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#9ca3af',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>📝</div>
              <div>No recent activity</div>
            </div>
          )}
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const forbiddenWords = ['spam', 'fake', 'scam', 'hack', 'illegal'];

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    // Check for forbidden words in title
    const titleLower = title.toLowerCase();
    const foundForbiddenWord = forbiddenWords.find(word => titleLower.includes(word));
    if (foundForbiddenWord) {
      newErrors.title = `Title contains forbidden word: "${foundForbiddenWord}"`;
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    } else if (description.length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }

    // Check for forbidden words in description
    const descLower = description.toLowerCase();
    const foundDescWord = forbiddenWords.find(word => descLower.includes(word));
    if (foundDescWord) {
      newErrors.description = `Description contains forbidden word: "${foundDescWord}"`;
    }

    // Tags validation
    if (tags.trim()) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      if (tagArray.length > 10) {
        newErrors.tags = 'Maximum 10 tags allowed';
      }
      if (tagArray.some(tag => tag.length > 50)) {
        newErrors.tags = 'Each tag must not exceed 50 characters';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit({
      title: title.trim(),
      contentType,
      description: description.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      region
    });
  };

  return (
    <div className="card" style={{background: '#f8fafc', marginBottom: '1.5rem'}}>
      <h3 style={{marginBottom: '1rem'}}>Upload New Knowledge Asset</h3>
      
      {Object.keys(errors).length > 0 && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: '#fee2e2',
          borderLeft: '4px solid #ef4444',
          borderRadius: '4px'
        }}>
          <div style={{fontWeight: '600', color: '#ef4444', marginBottom: '0.5rem'}}>
            ⚠ Validation Errors:
          </div>
          <ul style={{margin: 0, paddingLeft: '1.5rem', color: '#dc2626'}}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Title <span style={{color: '#ef4444'}}>*</span>
            <span style={{fontSize: '0.85rem', color: '#6b7280', marginLeft: '0.5rem'}}>
              (5-200 characters)
            </span>
          </label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({...errors, title: undefined});
            }}
            style={{borderColor: errors.title ? '#ef4444' : undefined}}
          />
          {errors.title && (
            <div style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem'}}>
              {errors.title}
            </div>
          )}
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
          <label className="form-label">
            Description <span style={{color: '#ef4444'}}>*</span>
            <span style={{fontSize: '0.85rem', color: '#6b7280', marginLeft: '0.5rem'}}>
              (20-2000 characters)
            </span>
          </label>
          <textarea
            className="form-input"
            rows="5"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({...errors, description: undefined});
            }}
            style={{borderColor: errors.description ? '#ef4444' : undefined}}
          />
          <div style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem'}}>
            {description.length}/2000 characters
          </div>
          {errors.description && (
            <div style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem'}}>
              {errors.description}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Tags (comma-separated)
            <span style={{fontSize: '0.85rem', color: '#6b7280', marginLeft: '0.5rem'}}>
              (Max 10 tags, 50 chars each)
            </span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., cloud, migration, AWS"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              if (errors.tags) setErrors({...errors, tags: undefined});
            }}
            style={{borderColor: errors.tags ? '#ef4444' : undefined}}
          />
          {errors.tags && (
            <div style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem'}}>
              {errors.tags}
            </div>
          )}
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
  const [showFullContent, setShowFullContent] = React.useState(false);
  const [viewCount, setViewCount] = React.useState(asset.viewCount || 0);
  const [downloadCount, setDownloadCount] = React.useState(asset.downloadCount || 0);
  const [liked, setLiked] = React.useState(false);

  const handleDownload = () => {
    // Simulate download
    setDownloadCount(downloadCount + 1);
    const blob = new Blob([asset.content || asset.description], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleView = () => {
    if (!showFullContent) {
      setViewCount(viewCount + 1);
    }
    setShowFullContent(!showFullContent);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="asset-card" style={{position: 'relative', overflow: 'hidden'}}>
      {/* Status Ribbon */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '-35px',
        transform: 'rotate(45deg)',
        background: asset.status === 'approved' ? '#22c55e' : asset.status === 'pending' ? '#f59e0b' : '#ef4444',
        color: 'white',
        padding: '5px 40px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {asset.status}
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginTop: '10px'}}>
        <div style={{flex: 1}}>
          {/* Header Section */}
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <span style={{fontSize: '2rem'}}>
              {asset.contentType === 'Document' ? '📄' : 
               asset.contentType === 'Template' ? '📋' : 
               asset.contentType === 'Framework' ? '🏗️' : 
               asset.contentType === 'Checklist' ? '✅' : 
               asset.contentType === 'Guide' ? '📚' : '📄'}
            </span>
            <div style={{flex: 1}}>
              <h3 className="asset-title" style={{marginBottom: '0.25rem'}}>{asset.title}</h3>
              {asset.author && (
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>
                  by <strong>{asset.author}</strong> • {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Unknown date'}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{color: '#666', marginBottom: '0.75rem', lineHeight: '1.5'}}>
            {asset.description}
          </p>
          
          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <div className="asset-tags" style={{marginBottom: '0.75rem'}}>
              {asset.tags.map((tag, idx) => (
                <span key={idx} className="asset-tag" style={{
                  background: '#e0e7ff',
                  color: '#4338ca',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.25rem'}}>📄</span>
              <div style={{fontSize: '0.75rem'}}>
                <div style={{color: '#6b7280'}}>Type</div>
                <div style={{fontWeight: '600', color: '#374151'}}>{asset.contentType}</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.25rem'}}>🌍</span>
              <div style={{fontSize: '0.75rem'}}>
                <div style={{color: '#6b7280'}}>Region</div>
                <div style={{fontWeight: '600', color: '#374151'}}>{asset.region}</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.25rem'}}>👁</span>
              <div style={{fontSize: '0.75rem'}}>
                <div style={{color: '#6b7280'}}>Views</div>
                <div style={{fontWeight: '600', color: '#374151'}}>{viewCount}</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.25rem'}}>⬇</span>
              <div style={{fontSize: '0.75rem'}}>
                <div style={{color: '#6b7280'}}>Downloads</div>
                <div style={{fontWeight: '600', color: '#374151'}}>{downloadCount}</div>
              </div>
            </div>
            {asset.category && (
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{fontSize: '1.25rem'}}>📂</span>
                <div style={{fontSize: '0.75rem'}}>
                  <div style={{color: '#6b7280'}}>Category</div>
                  <div style={{fontWeight: '600', color: '#374151'}}>{asset.category}</div>
                </div>
              </div>
            )}
          </div>

          {/* Content Preview/Full */}
          {asset.content && (
            <div style={{marginBottom: '1rem'}}>
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                color: 'white'
              }}>
                <div style={{fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  📝 Content
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  maxHeight: showFullContent ? 'none' : '100px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {showFullContent ? asset.content : truncateText(asset.content, 150)}
                  {!showFullContent && asset.content.length > 150 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40px',
                      background: 'linear-gradient(transparent, rgba(102, 126, 234, 0.9))'
                    }} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {asset.content && (
              <button 
                className="btn btn-secondary btn-small"
                onClick={handleView}
                style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                {showFullContent ? '📖 Show Less' : '📖 Read More'}
              </button>
            )}
            <button 
              className="btn btn-primary btn-small"
              onClick={handleDownload}
              style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
            >
              ⬇ Download
            </button>
            <button 
              className="btn btn-secondary btn-small"
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: liked ? '#ef4444' : '#e5e7eb',
                color: liked ? 'white' : '#374151'
              }}
            >
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>
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
  const [expandedAssets, setExpandedAssets] = useState({});

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

  const toggleAssetDetails = (assetId) => {
    setExpandedAssets(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateTimeDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = Math.abs(end - start);
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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
                  <span>📄 {asset.category || asset.contentType}</span>
                  <span>🌍 {asset.region || 'N/A'}</span>
                  <span>📅 {new Date(asset.createdAt || asset.createdDate).toLocaleDateString()}</span>
                </div>

                {/* Time Details - Show More Section */}
                <div style={{marginTop: '1rem'}}>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => toggleAssetDetails(asset.id)}
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {expandedAssets[asset.id] ? '▲ Show Less' : '▼ Show More'}
                  </button>

                  {expandedAssets[asset.id] && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db'
                    }}>
                      <div style={{fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        ⏰ Time Details
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
                        {/* Created Date */}
                        <div style={{
                          padding: '0.75rem',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                            📅 Created Date
                          </div>
                          <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#1f2937'}}>
                            {formatDateTime(asset.createdAt || asset.createdDate)}
                          </div>
                        </div>

                        {/* Pending Duration */}
                        <div style={{
                          padding: '0.75rem',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                            ⏳ Pending For
                          </div>
                          <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#f59e0b'}}>
                            {calculateTimeDifference(asset.createdAt || asset.createdDate)}
                          </div>
                        </div>

                        {/* Updated Date */}
                        {(asset.updatedAt || asset.updatedDate) && (asset.updatedAt || asset.updatedDate) !== (asset.createdAt || asset.createdDate) && (
                          <div style={{
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                              🔄 Last Updated
                            </div>
                            <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#1f2937'}}>
                              {formatDateTime(asset.updatedAt || asset.updatedDate)}
                            </div>
                          </div>
                        )}

                        {/* Reviewed Date */}
                        {(asset.reviewedAt || asset.reviewedDate) && (
                          <div style={{
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                              ✓ Reviewed Date
                            </div>
                            <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#10b981'}}>
                              {formatDateTime(asset.reviewedAt || asset.reviewedDate)}
                            </div>
                          </div>
                        )}

                        {/* Creator Info */}
                        {(asset.authorId || asset.creatorID) && (
                          <div style={{
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            gridColumn: '1 / -1'
                          }}>
                            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                              👤 Submitted By
                            </div>
                            <div style={{fontSize: '0.85rem', fontWeight: '600', color: '#1f2937'}}>
                              User ID: {asset.authorId || asset.creatorID}
                            </div>
                          </div>
                        )}

                        {/* Full Content */}
                        {asset.content && (
                          <div style={{
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            gridColumn: '1 / -1'
                          }}>
                            <div style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>
                              📝 Full Content
                            </div>
                            <div style={{
                              fontSize: '0.85rem',
                              color: '#374151',
                              whiteSpace: 'pre-wrap',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              lineHeight: '1.5'
                            }}>
                              {asset.content}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
