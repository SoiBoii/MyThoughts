# MyThoughts — Modern News-style App with AI Assist

A full-stack news/blog application with a modern UI, search/filter/sort/pagination, article CRUD, trending, categories, and AI-assisted summary/tag suggestions.

- Frontend: React + Vite
- Backend: Node.js + Express + Sequelize (SQLite)

## 🚀 Live Demo
**Frontend**: [https://soiboii.github.io/MyThoughts/](https://soiboii.github.io/MyThoughts/)

*Note: The live demo is frontend-only. For full functionality, deploy the backend or run it locally.*

## Features
- Modern news layout: hero, grid cards with images, trending sidebar, categories chips
- Article CRUD: create, read, update, delete
- Search, category filter, sort, pagination with total count
- AI assist: suggest summary and tags from title/content
- Views tracking and trending list

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Backend
```bash
cd backend
npm install
npm start
# Server: http://localhost:5001
```
- SQLite DB file is created automatically at `backend/database.sqlite`.
- Models auto-sync via Sequelize on server start.

### Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

## Project Structure
```
backend/
  models/Article.js
  routes/articles.js
  server.js
frontend/
  src/
    pages/ArticleList.jsx
    pages/ArticlePage.jsx
    pages/CreateArticle.jsx
    pages/EditArticle.jsx
    App.jsx
    index.css
```

## Environment
No `.env` required for local. Defaults:
- Backend: `http://localhost:5001`
- Frontend dev: `http://localhost:5173`

## API Overview
Base URL: `http://localhost:5001/api/articles`

- GET `/` — list articles with query params:
  - `q`, `category`, `page`, `pageSize`, `sortBy` (createdAt|publishedAt|title|category), `sortDir` (ASC|DESC)
  - Response: `{ data, total, page, pageSize }`
- POST `/add` — create article
- GET `/:id` — get one
- PUT `/:id` — update
- DELETE `/:id` — delete
- POST `/:id/view` — increment views
- GET `/_meta/trending?limit=5` — trending by views
- GET `/_meta/categories` — list unique categories
- POST `/_ai/suggest` — AI-like summary/tags from content (local deterministic helper)

Article fields:
- `title` (string, required)
- `author` (string, default "Staff Writer")
- `content` (text, required)
- `summary` (text)
- `category` (string, default "General")
- `imageUrl` (string)
- `tags` (comma-separated string)
- `views` (number, default 0)
- `publishedAt` (date, default now)

## Development Notes
- Edit page at `/article/:id/edit`
- Create page includes an "AI: Suggest summary & tags" button
- Opening an article increments views for trending

## Scripts
Backend:
- `npm start` — start Express API

Frontend:
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build

## Deployment

### GitHub Pages (Frontend)
The frontend is automatically deployed to GitHub Pages on every push to `main`:
- **Live URL**: https://soiboii.github.io/MyThoughts/
- **Auto-deployment**: GitHub Action builds and deploys on push
- **Configuration**: Vite config set with `base: '/MyThoughts/'`

### Backend Deployment

#### Option 1: Railway (Recommended - Free Tier)
1. Go to [Railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `MyThoughts` repository
4. Railway will auto-detect the backend and deploy it
5. Copy the generated URL (e.g., `https://mythoughts-backend-production.railway.app`)
6. Set environment variable in Railway dashboard: `NODE_ENV=production`

#### Option 2: Render
1. Go to [Render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Use the `render.yaml` config file (already included)
5. Deploy and get your backend URL

#### Option 3: Heroku
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `git subtree push --prefix backend heroku main`

### Connect Frontend to Backend
After deploying the backend:
1. Copy your backend URL (e.g., `https://mythoughts-backend.railway.app`)
2. In your GitHub repo, go to Settings → Secrets and variables → Actions
3. Add a new secret: `VITE_API_URL` = your backend URL
4. The GitHub Action will automatically use this for the frontend build

### Local Development with Production Backend
Create `frontend/.env.local`:
```
VITE_API_URL=https://your-backend-url.railway.app
```

## License
MIT

---
Repo: https://github.com/SoiBoii/MyThoughts
