# MyThoughts — Modern News-style App with AI Assist

A full-stack news/blog application with a modern UI, search/filter/sort/pagination, article CRUD, trending, categories, and AI-assisted summary/tag suggestions.

- Frontend: React + Vite
- Backend: Node.js + Express + Sequelize (SQLite)

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
- Backend can run anywhere Node 18+ is available. Persist `database.sqlite` or switch Sequelize to another dialect.
- Frontend can be built and hosted on any static host (e.g., GitHub Pages, Netlify, Vercel). Configure API URL if backend is remote.

## License
MIT

---
Repo: https://github.com/SoiBoii/MyThoughts
