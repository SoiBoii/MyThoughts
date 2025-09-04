import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ArticlePage() {
    const [article, setArticle] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.get(`${apiUrl}/api/articles/${id}`)
            .then(response => {
                setArticle(response.data);
                axios.post(`${apiUrl}/api/articles/${id}/view`).catch(() => {});
            })
            .catch(error => {
                console.error('There was an error fetching the article!', error);
            });
    }, [id]);

    if (!article) return <div>Loading...</div>;

    return (
        <div className="container">
            <Link to="/" className="back-link">&larr; Back to all articles</Link>
            <div className="full-article">
                {article.imageUrl && <img src={article.imageUrl} alt={article.title} style={{width:'100%', borderRadius: '12px', marginBottom: '12px'}} />}
                <h1>{article.title}</h1>
                <p className="meta">By {article.author || 'Staff'} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''} · {article.views || 0} views</p>
                {article.tags && (
                    <div className="chips" style={{marginBottom: '8px'}}>
                        {String(article.tags).split(',').filter(Boolean).map(t => (
                            <span key={t} className="chip" style={{cursor:'default'}}>{t}</span>
                        ))}
                    </div>
                )}
                <div className="article-content">{article.content}</div>
                <div className="article-actions">
                    <Link to={`/article/${id}/edit`} className="btn btn-secondary">Edit</Link>
                    <button className="btn btn-danger" disabled={deleting} onClick={async () => {
                        if (!confirm('Delete this article?')) return;
                        try {
                            setDeleting(true);
                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                            await axios.delete(`${apiUrl}/api/articles/${id}`);
                            navigate('/');
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setDeleting(false);
                        }
                    }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ArticlePage;