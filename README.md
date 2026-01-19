# 🌐 Velion Dynamics - Digital Knowledge Network

## Separated Frontend & Backend Architecture

A modern, professional knowledge management system with **completely separated** frontend and backend.

---

## 📦 Project Structure

```
velion-dkn-separated/
├── backend/          # Node.js REST API (Port 5000)
│   ├── server.js
│   ├── database.js
│   ├── init-db.js
│   ├── package.json
│   └── database/
│
├── frontend/         # React Application (Port 3000)
│   ├── index.html
│   ├── app.js
│   └── package.json
│
└── README.md         # This file
```

---

## 🚀 Quick Start (Both Servers)

### Option 1: Start Both Together

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run init-db
npm start

# Terminal 2 - Frontend (in new terminal)
cd frontend
npm install
npm start
```

### Option 2: Step by Step

#### Step 1: Start Backend
```bash
cd backend
npm install
npm run init-db
npm start
```
✅ Backend running on http://localhost:5000

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000

---

## 🔌 How They Connect

```
┌─────────────────┐         HTTP API Calls        ┌─────────────────┐
│                 │ ─────────────────────────────> │                 │
│   Frontend      │         JWT Authentication     │    Backend      │
│   (React)       │ <───────────────────────────── │   (Express)     │
│   Port 3000     │         JSON Responses         │   Port 5000     │
└─────────────────┘                                └─────────────────┘
```

### Communication:
- **Frontend** → Makes API calls to `http://localhost:5000/api`
- **Backend** → Returns JSON data
- **CORS** → Enabled for frontend access

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT token-based authentication
- Secure password hashing

### 📚 Knowledge Management
- Upload documents, templates, frameworks
- Search and filter assets
- Tag-based organization
- View/download tracking

### 🔍 Review System
- Knowledge Champions review submissions
- Approve/reject workflow
- Feedback and comments
- Quality assurance

### 🏆 Gamification
- Points for contributions
- Leaderboard rankings
- Recognition system
- Training completion rewards

### 🤖 AI Features
- Personalized recommendations
- Expert matching
- Smart content suggestions

### 📊 Analytics
- Dashboard statistics
- Performance metrics
- Audit logs

---

## 🔑 Demo Accounts

After running `npm run init-db` in backend:

| Role | Email | Password |
|------|-------|----------|
| **Knowledge Champion** | maria.rodriguez@veliondynamics.com | password123 |
| **Senior Consultant** | sarah.mitchell@veliondynamics.com | password123 |
| **Consultant** | james.chen@veliondynamics.com | password123 |
| **Junior Consultant** | alex.kumar@veliondynamics.com | password123 |

---

## 🛠️ Technology Stack

### Backend:
- Node.js + Express
- JWT Authentication
- bcryptjs (password hashing)
- JSON File Database
- CORS enabled

### Frontend:
- React 18
- Modern CSS3
- Responsive design
- Blue/Purple gradient theme
- No build tools required

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/me`

### Knowledge Assets
- `GET /api/knowledge-assets`
- `POST /api/knowledge-assets`
- `PUT /api/knowledge-assets/:id`
- `POST /api/knowledge-assets/:id/review`
- `GET /api/knowledge-assets/pending/review`

### Other Endpoints
- Consultants: `/api/consultants/*`
- Leaderboard: `/api/leaderboard`
- Training: `/api/trainings/*`
- Statistics: `/api/statistics`
- AI: `/api/recommendations/*`

---

## 🧪 Testing Workflow

### Test 1: User Registration
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill form and register
4. Auto-logged in!

### Test 2: Knowledge Upload
1. Login as James
2. Go to "Repository"
3. Click "+ Upload Asset"
4. Fill and submit
5. See "Awaiting Review"

### Test 3: Review Process
1. Logout
2. Login as Maria (Knowledge Champion)
3. Click "Review" tab
4. Review pending asset
5. Add comments
6. Approve
7. James gets +50 points!

### Test 4: Check Leaderboard
1. Go to "Leaderboard"
2. See James with +50 points
3. Rankings updated!

---

## 🌐 Deployment

### Backend Deployment:

**Heroku:**
```bash
cd backend
heroku create velion-dkn-api
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Render/Railway:**
1. Connect Git repository
2. Set environment variables
3. Deploy

### Frontend Deployment:

**Vercel:**
```bash
cd frontend
vercel --prod
```

**Netlify:**
```bash
cd frontend
netlify deploy --prod
```

**Update API URL in frontend/app.js:**
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

---

## ⚙️ Configuration

### Backend (.env):
```env
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (app.js):
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📖 Detailed Documentation

- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

---

## 🎯 Why Separated?

### ✅ Advantages:

1. **Independent Deployment**
   - Deploy frontend and backend separately
   - Update one without affecting the other

2. **Scalability**
   - Scale backend independently
   - Add multiple frontends (mobile, desktop)

3. **Development**
   - Different teams can work separately
   - Clear separation of concerns

4. **Flexibility**
   - Use different hosting platforms
   - Easy to add new frontends

5. **Professional**
   - Industry-standard architecture
   - Production-ready structure

---

## 🔧 Development Tips

### Run Both in Development:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### Reset Database:
```bash
cd backend
npm run init-db
```

### Check Backend API:
```bash
curl http://localhost:5000/api/statistics
```

---

## 🆘 Troubleshooting

### CORS Errors:
- Ensure backend CORS allows frontend URL
- Check `FRONTEND_URL` in backend `.env`

### Connection Refused:
- Make sure backend is running (port 5000)
- Check API_URL in frontend app.js

### Port Already in Use:
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Project Checklist

- [x] Separated frontend & backend
- [x] Independent package.json files
- [x] CORS configured
- [x] JWT authentication
- [x] REST API complete
- [x] Modern React UI
- [x] Responsive design
- [x] Full documentation
- [x] Ready to deploy
- [x] Professional structure

---

## 🎓 For Your Assignment

This project demonstrates:

✅ **Component-Based Architecture**
✅ **REST API Design**
✅ **Frontend/Backend Separation**
✅ **Modern Web Development**
✅ **Professional Code Structure**
✅ **Complete Documentation**
✅ **Production-Ready**

---

## 🎨 Design

**Theme:** Modern Blue/Purple Gradient
**Style:** Clean, Professional, Card-based
**Colors:** 
- Primary: #2563eb (Blue)
- Gradient: #667eea to #764ba2

---

## 📝 Key Files

### Backend:
- `server.js` - Express server & API routes
- `database.js` - Database abstraction
- `init-db.js` - Sample data initialization

### Frontend:
- `index.html` - HTML structure & CSS
- `app.js` - React application

---

## 🚀 You're All Set!

1. ✅ Backend runs on port 5000
2. ✅ Frontend runs on port 3000
3. ✅ They communicate via REST API
4. ✅ Completely separated
5. ✅ Production-ready

**Start both servers and go to http://localhost:3000!**

---

**Version 2.0 - Separated Architecture** 🌟

Professional. Modern. Production-Ready. 🚀
