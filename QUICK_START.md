# 🚀 QUICK START - Separated Frontend & Backend

## 🎯 What You Have

✅ **Backend** - REST API (Port 5000)
✅ **Frontend** - React App (Port 3000)
✅ **Completely Separated** - Professional structure!

---

## ⚡ Start in 2 Minutes!

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run init-db
npm start
```
✅ **Backend running:** http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```
✅ **Frontend running:** http://localhost:3000

**That's it! Open http://localhost:3000 in your browser! 🎉**

---

## 📂 Folder Structure

```
velion-dkn-separated/
├── 📁 backend/        ← Node.js API Server
│   ├── server.js      ← Express routes
│   ├── database.js    ← Database layer
│   ├── init-db.js     ← Sample data
│   ├── package.json   ← Backend dependencies
│   └── database/      ← JSON data files
│
├── 📁 frontend/       ← React Application
│   ├── index.html     ← HTML + CSS
│   ├── app.js         ← React app
│   └── package.json   ← Frontend dependencies
│
└── 📄 README.md       ← Main docs
```

---

## 🔌 How They Work Together

```
┌──────────────┐              ┌──────────────┐
│   Browser    │              │   Backend    │
│              │   API Calls  │              │
│  localhost   │ ───────────> │  localhost   │
│  :3000       │   (REST API) │  :5000       │
│  (Frontend)  │ <─────────── │  (Server)    │
│              │   JSON Data  │              │
└──────────────┘              └──────────────┘
```

**Communication:**
- Frontend sends HTTP requests
- Backend processes and responds
- CORS enabled for cross-origin

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Knowledge Champion | maria.rodriguez@veliondynamics.com | password123 |
| Consultant | james.chen@veliondynamics.com | password123 |

**Or create your own account!**

---

## 🧪 Test Workflow

### 1. Register New Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill the form
4. Create account
5. You're in!

### 2. Upload Knowledge
1. Login
2. Click "Repository" tab
3. Click "+ Upload Asset"
4. Fill form and upload
5. See "Awaiting Review" status

### 3. Review (as Champion)
1. Logout
2. Login as Maria (Knowledge Champion)
3. Click "Review" tab
4. Review pending asset
5. Approve it
6. User gets +50 points!

### 4. Check Leaderboard
1. Click "Leaderboard" tab
2. See updated points
3. Rankings changed!

---

## 📝 What's Different?

### ✅ Separated Architecture:

| Before | After |
|--------|-------|
| ❌ Everything in one folder | ✅ Frontend & Backend separated |
| ❌ Coupled code | ✅ Independent deployment |
| ❌ Hard to scale | ✅ Easy to scale |
| ❌ Complex structure | ✅ Clean & professional |

### ✅ Benefits:

1. **Deploy Independently**
   - Update frontend without touching backend
   - Update backend without touching frontend

2. **Professional Structure**
   - Industry-standard architecture
   - Clear separation of concerns

3. **Easy Development**
   - Different teams can work separately
   - Run backend only for testing API

4. **Scalability**
   - Scale backend separately
   - Add mobile app easily

5. **Portfolio Ready**
   - Shows professional skills
   - Modern development practices

---

## 🌐 Deploy to Production

### Backend (Choose One):

**Heroku:**
```bash
cd backend
heroku create my-dkn-api
heroku config:set JWT_SECRET=my-secret-123
git push heroku main
```

**Render:**
1. Connect GitHub repo
2. Select `/backend` folder
3. Set environment variables
4. Deploy

### Frontend (Choose One):

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

### ⚠️ Important After Deployment:

Update frontend API URL in `frontend/app.js`:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

---

## 🆘 Troubleshooting

### Backend won't start:
```bash
# Port 5000 busy?
lsof -ti:5000 | xargs kill -9
```

### Frontend won't start:
```bash
# Port 3000 busy?
lsof -ti:3000 | xargs kill -9
```

### CORS errors:
- Make sure backend is running
- Check backend console for errors
- Verify frontend URL in backend

### Can't login:
- Backend must be running on port 5000
- Check API_URL in frontend/app.js
- Try credentials again

### Database empty:
```bash
cd backend
npm run init-db
```

---

## 📊 Features Overview

### Backend (REST API):
- ✅ JWT Authentication
- ✅ User Management
- ✅ Knowledge CRUD
- ✅ Review System
- ✅ Leaderboard
- ✅ Training Modules
- ✅ AI Recommendations
- ✅ Audit Logging

### Frontend (React):
- ✅ Modern Login/Signup
- ✅ Dashboard Stats
- ✅ Knowledge Repository
- ✅ Review Interface
- ✅ Leaderboard Rankings
- ✅ Training System
- ✅ AI Insights
- ✅ Responsive Design

---

## 🎯 Type Models Implemented

Based on your coursework:

- ✅ ConsultantType
- ✅ KnowledgeAssetType
- ✅ RepositoryType
- ✅ MetadataType
- ✅ AuditEntryType
- ✅ GamificationType
- ✅ LeaderboardEntryType
- ✅ TrainingModuleType
- ✅ AIRecommendationType

---

## 🔧 Development Mode

### Backend with auto-reload:
```bash
cd backend
npm run dev
```

### Both together:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

---

## 📦 What's in the Package?

```
✅ Backend API server
✅ Frontend React app
✅ Sample database
✅ Complete documentation
✅ Deployment configs
✅ Professional structure
✅ Ready to run
✅ Ready to deploy
```

---

## 🎨 UI Design

**Theme:** Professional Blue/Purple
**Style:** Modern gradient cards
**Layout:** Clean and responsive

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Check backend terminal** for API logs
3. **Use Chrome DevTools** for debugging frontend
4. **Test API separately** with Postman/curl
5. **Read individual READMEs** for detailed docs

---

## 🎓 Perfect for Coursework

This structure demonstrates:

✅ Professional software architecture
✅ REST API design
✅ Frontend/Backend separation
✅ Component-based development
✅ Modern web technologies
✅ Production-ready code

---

## ✨ Quick Commands Reference

| Command | Location | Purpose |
|---------|----------|---------|
| `npm install` | backend/ | Install backend deps |
| `npm run init-db` | backend/ | Create sample data |
| `npm start` | backend/ | Start API server |
| `npm run dev` | backend/ | Start with auto-reload |
| `npm install` | frontend/ | Install frontend deps |
| `npm start` | frontend/ | Start React app |

---

## 🚀 You're Ready!

**Two simple steps:**
1. Start backend (Terminal 1)
2. Start frontend (Terminal 2)

**Then open:** http://localhost:3000

**That's it! Enjoy your separated, professional DKN system! 🎉**

---

**Questions? Check the README files in each folder!** 📚
