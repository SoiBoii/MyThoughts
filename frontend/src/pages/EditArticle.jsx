import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [publishedAt, setPublishedAt] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.get(`${apiUrl}/api/articles/${id}`)
            .then(res => {
                const a = res.data;
                setTitle(a.title || '');
                setContent(a.content || '');
                setCategory(a.category || '');
                setPublishedAt(a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0,16) : '');
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !category.trim()) return;
        setSaving(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.put(`${apiUrl}/api/articles/${id}` , {
            title, content, category, publishedAt: publishedAt || undefined
        }).then(() => navigate(`/article/${id}`))
          .catch(err => console.error(err))
          .finally(() => setSaving(false));
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <Link to={`/article/${id}`} className="back-link">← Back</Link>
            <h1>Edit Article</h1>
            <form onSubmit={handleSubmit} className="article-form">
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Published At</label>
                    <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea rows="10" required value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <button type="submit" className="submit-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
        </div>
    );
}

export default EditArticle;


