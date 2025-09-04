import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateArticle() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('Technology');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [publishedAt, setPublishedAt] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !category.trim()) return;
        const newArticle = { title, author, content, summary, category, imageUrl, tags, publishedAt: publishedAt || undefined };
        setSubmitting(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        axios.post(`${apiUrl}/api/articles/add`, newArticle)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.error(err))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="container">
            <h1>Write a New Thought</h1>
            <form onSubmit={handleSubmit} className="article-form">
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Summary</label>
                    <textarea rows="3" value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Published At</label>
                    <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea rows="10" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div className="form-group">
                    <button type="button" className="btn" onClick={async () => {
                        try {
                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                            const r = await axios.post(`${apiUrl}/api/articles/_ai/suggest`, { title, content });
                            setSummary(prev => prev || r.data.summary || '');
                            setTags(prev => prev || r.data.tags || '');
                        } catch (e) { console.error(e); }
                    }}>AI: Suggest summary & tags</button>
                </div>
                <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Publishing...' : 'Publish'}</button>
            </form>
        </div>
    );
}

export default CreateArticle;