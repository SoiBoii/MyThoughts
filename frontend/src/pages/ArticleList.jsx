import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [trending, setTrending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [q, setQ] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchArticles = () => {
        setLoading(true);
        const params = { q, category, page, pageSize, sortBy: 'publishedAt', sortDir: 'DESC' };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.get(`${apiUrl}/api/articles`, { params })
            .then(response => {
                setArticles(response.data.data);
                setTotal(response.data.total);
            })
            .catch(error => {
                console.error('There was an error fetching the articles!', error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, category, page, pageSize]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.get(`${apiUrl}/api/articles/_meta/trending`).then(r => setTrending(r.data));
        axios.get(`${apiUrl}/api/articles/_meta/categories`).then(r => setCategories(r.data));
    }, []);

    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    return (
        <div className="container">
            <h1>Latest Thoughts</h1>
            <div className="toolbar">
                <input
                    className="input"
                    type="text"
                    placeholder="Search articles..."
                    value={q}
                    onChange={(e) => { setPage(1); setQ(e.target.value); }}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Filter by category"
                    value={category}
                    onChange={(e) => { setPage(1); setCategory(e.target.value); }}
                />
                <select
                    className="select"
                    value={pageSize}
                    onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
                >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                </select>
            </div>

            <div className="news-layout">
                <section className="news-main">
                    <div className="hero" style={{display: articles[0] ? 'block' : 'none'}}>
                        {articles[0] && (
                            <Link to={`/article/${articles[0].id}`} className="hero-card" style={{backgroundImage: `url(${articles[0].imageUrl || ''})`}}>
                                <div className="hero-overlay">
                                    <span className="badge">{articles[0].category}</span>
                                    <h2>{articles[0].title}</h2>
                                    <p className="meta">By {articles[0].author || 'Staff'} · {articles[0].publishedAt ? new Date(articles[0].publishedAt).toLocaleDateString() : ''}</p>
                                    <p className="summary">{articles[0].summary || (articles[0].content || '').substring(0, 140) + '...'}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="grid">
                        {loading && <div>Loading...</div>}
                        {!loading && articles.slice(1).map(article => (
                            <div key={article.id} className="grid-card">
                                {article.imageUrl && <Link to={`/article/${article.id}`}><img className="thumb" src={article.imageUrl} alt={article.title} /></Link>}
                                <div className="grid-card-body">
                                    <span className="badge">{article.category}</span>
                                    <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
                                    <p className="meta">By {article.author || 'Staff'} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</p>
                                    <p className="summary">{article.summary || (article.content || '').substring(0, 120) + '...'}</p>
                                </div>
                            </div>
                        ))}
                        {!loading && articles.length <= 1 && (
                            <div className="empty">No more articles.</div>
                        )}
                    </div>

                    <div className="pagination">
                        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
                        <span className="page-info">Page {page} of {totalPages}</span>
                        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </section>
                <aside className="news-sidebar">
                    <div className="sidebar-card">
                        <h3>Categories</h3>
                        <div className="chips">
                            <button className={`chip ${category === '' ? 'active' : ''}`} onClick={() => { setCategory(''); setPage(1); }}>All</button>
                            {categories.map(cat => (
                                <button key={cat} className={`chip ${category === cat ? 'active' : ''}`} onClick={() => { setCategory(cat); setPage(1); }}>{cat}</button>
                            ))}
                        </div>
                    </div>
                    <div className="sidebar-card">
                        <h3>Trending</h3>
                        <ul className="trending-list">
                            {trending.map(t => (
                                <li key={t.id}>
                                    <Link to={`/article/${t.id}`}>{t.title}</Link>
                                    <div className="meta">{t.views} views</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            <div className="pagination">
                <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span className="page-info">Page {page} of {totalPages}</span>
                <button className="btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
}

export default ArticleList;