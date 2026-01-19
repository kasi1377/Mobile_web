# 🎨 Velion Dynamics DKN - Frontend

Modern React frontend for Digital Knowledge Network.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

**Frontend runs on:** http://localhost:3000

## ⚙️ Configuration

### Backend URL

Edit `app.js` line 2:
```javascript
const API_URL = 'http://localhost:5000/api';
```

For production, change to your deployed backend URL:
```javascript
const API_URL = 'https://your-backend.herokuapp.com/api';
```

## 📦 What's Included

### Components:
- **AuthPage** - Login & Signup
- **Dashboard** - Statistics overview
- **KnowledgeRepository** - Browse & upload assets
- **ReviewManagement** - Review pending submissions
- **Leaderboard** - Rankings & points
- **Training** - Learning modules
- **AIInsights** - Recommendations

### Features:
- ✨ Modern gradient design (Blue/Purple)
- 🎴 Clean card-based UI
- 📱 Fully responsive
- ⚡ Smooth animations
- 🔒 JWT authentication
- 🎯 Role-based UI

## 🎨 Design

### Color Theme:
- Primary: Blue (#2563eb)
- Secondary: Purple (#764ba2)
- Gradient background
- Clean white cards

### Typography:
- Segoe UI font family
- Clear hierarchy
- Readable sizes

## 📁 File Structure

```
frontend/
├── index.html      # HTML structure & CSS
├── app.js          # React application
├── package.json    # Dependencies & scripts
└── README.md       # This file
```

## 🔌 API Integration

All API calls go through the `api` object in `app.js`:

```javascript
const api = {
  login: async (email, password) => { ... },
  signup: async (userData) => { ... },
  getKnowledgeAssets: async (token) => { ... },
  // ... etc
};
```

## 🔑 Authentication Flow

1. User enters credentials
2. Frontend sends to `/api/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token sent with all requests

## 🛠️ Development

### Local Development:
```bash
npm start
```

### Testing with Backend:
1. Start backend: `cd ../backend && npm start`
2. Start frontend: `npm start`
3. Open: http://localhost:3000

## 🌐 Deployment

### Deploy to Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Deploy to GitHub Pages:
1. Push to GitHub
2. Enable GitHub Pages in settings
3. Select branch and folder

**Remember to update API_URL in app.js!**

## 📱 Responsive Design

Works on:
- 💻 Desktop
- 📱 Mobile
- 📊 Tablet

## 🎯 Browser Support

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🔧 Customization

### Change Theme Colors:

Edit `index.html` CSS variables:
```css
:root {
  --primary: #2563eb;  /* Change primary color */
  --secondary: #10b981;
  /* ... */
}
```

### Change Gradient:

Edit `.auth-page` background:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📝 Dependencies

- React 18 (CDN)
- React DOM 18 (CDN)
- Babel Standalone (CDN)
- http-server (dev server)

**No build step required!** Pure JavaScript approach.

## 🆘 Troubleshooting

### CORS Errors:
- Make sure backend is running
- Check backend CORS configuration
- Verify API_URL is correct

### Can't Login:
- Check backend is running on port 5000
- Verify credentials are correct
- Check browser console for errors

### Blank Page:
- Open browser console (F12)
- Check for JavaScript errors
- Verify React loaded from CDN

## 🚀 Production Build (Optional)

For production, you can:

1. **Keep as-is** (Simple deployment)
2. **Use Create React App** (For complex apps)
3. **Use Vite** (Modern build tool)

Current setup works great for most cases!

## 📊 Features Checklist

- [x] User Authentication
- [x] Knowledge Upload
- [x] Search & Filter
- [x] Review System
- [x] Leaderboard
- [x] Training Modules
- [x] AI Recommendations
- [x] Dashboard Stats
- [x] Responsive Design
- [x] Modern UI/UX

---

**Beautiful frontend ready! 🎨**

Connect it to your backend and you're live! 🚀
