import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ArticleList from './pages/ArticleList';
import ArticlePage from './pages/ArticlePage';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import './index.css'; // We will create this file for styles

function App() {
    return (
        <Router>
            <nav>
                <div className="container">
                    <Link to="/" className="logo">My Thoughts</Link>
                    <div className="nav-actions">
                        <Link to="/create" className="btn btn-primary">Write Article</Link>
                    </div>
                </div>
            </nav>
            <main>
                <Routes>
                    <Route path="/" element={<ArticleList />} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                    <Route path="/create" element={<CreateArticle />} />
                    <Route path="/article/:id/edit" element={<EditArticle />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;