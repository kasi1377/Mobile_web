# 🔙 Velion Dynamics DKN - Backend API

REST API server for Digital Knowledge Network system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and set JWT_SECRET
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Server
```bash
npm start
```

**Server runs on:** http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Knowledge Assets
- `GET /api/knowledge-assets` - Get all assets
- `POST /api/knowledge-assets` - Create asset
- `PUT /api/knowledge-assets/:id` - Update asset
- `POST /api/knowledge-assets/:id/review` - Review asset
- `GET /api/knowledge-assets/pending/review` - Pending reviews
- `GET /api/knowledge-assets/my/submissions` - User submissions
- `GET /api/knowledge-assets/search/:term` - Search

### Consultants
- `GET /api/consultants` - Get all consultants
- `GET /api/consultants/:id` - Get consultant by ID
- `GET /api/consultants/search/:term` - Search consultants

### Leaderboard
- `GET /api/leaderboard` - Get rankings

### Training
- `GET /api/trainings` - Get all trainings
- `POST /api/trainings/:id/complete` - Complete training

### Statistics
- `GET /api/statistics` - Dashboard stats

### AI Recommendations
- `GET /api/recommendations/assets` - Asset recommendations
- `GET /api/recommendations/experts` - Expert recommendations

### Audit Logs
- `GET /api/audit-logs` - Activity logs

## 🔒 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 🗄️ Database

JSON file-based database in `./database/` directory:
- `consultants.json` - Users
- `knowledgeAssets.json` - Knowledge items
- `leaderboard.json` - Rankings
- `trainings.json` - Training modules
- `auditEntries.json` - Activity logs

## 🛠️ Development

```bash
npm run dev  # Auto-restart with nodemon
```

## 🌐 CORS

Configure `FRONTEND_URL` in `.env` to allow frontend access.

Default: `http://localhost:3000`

## 📦 Project Structure

```
backend/
├── server.js          # Express server & routes
├── database.js        # Database layer
├── init-db.js        # Database initialization
├── package.json      # Dependencies
├── .env.example      # Environment template
└── database/         # JSON data files
```

## 🔑 Demo Credentials

After running `npm run init-db`:

| Email | Password | Role |
|-------|----------|------|
| sarah.mitchell@veliondynamics.com | password123 | Senior Consultant |
| james.chen@veliondynamics.com | password123 | Consultant |
| maria.rodriguez@veliondynamics.com | password123 | Knowledge Champion |
| alex.kumar@veliondynamics.com | password123 | Junior Consultant |

## 🚀 Deployment

### Heroku
```bash
heroku create velion-dkn-api
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Vercel/Render
1. Set environment variables
2. Deploy via CLI or Git integration

## 📝 Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret (required)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - development/production

## 🔧 API Testing

Use Postman, curl, or any API client:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"james.chen@veliondynamics.com","password":"password123"}'

# Get assets (with token)
curl http://localhost:5000/api/knowledge-assets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Backend API ready for frontend integration! 🚀**
