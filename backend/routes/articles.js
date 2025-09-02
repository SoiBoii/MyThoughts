// backend/routes/articles.js

const router = require('express').Router();
const { Op } = require('sequelize');

module.exports = (Article) => {
    // GET: Fetch all articles
    router.get('/', async (req, res) => {
        try {
            const {
                q = '',
                category,
                page = 1,
                pageSize = 10,
                sortBy = 'createdAt',
                sortDir = 'DESC'
            } = req.query;

            const where = {};
            if (q) {
                const like = `%${q}%`;
                where[Op.or] = [
                    { title: { [Op.like]: like } },
                    { content: { [Op.like]: like } }
                ];
            }
            if (category) {
                where.category = category;
            }

            const numericPage = Math.max(parseInt(page, 10) || 1, 1);
            const numericPageSize = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
            const offset = (numericPage - 1) * numericPageSize;

            const validSortColumns = ['createdAt', 'publishedAt', 'title', 'category'];
            const orderColumn = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
            const orderDirection = String(sortDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            const { rows, count } = await Article.findAndCountAll({
                where,
                order: [[orderColumn, orderDirection]],
                offset,
                limit: numericPageSize
            });

            res.json({
                data: rows,
                total: count,
                page: numericPage,
                pageSize: numericPageSize
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST: Add a new article
    router.post('/add', async (req, res) => {
        try {
            const { title, author, content, summary, category, imageUrl, tags, publishedAt } = req.body;
            const newArticle = await Article.create({ title, author, content, summary, category, imageUrl, tags, publishedAt });
            res.status(201).json(newArticle);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET: Fetch a single article by ID
    router.get('/:id', async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id); // Find by Primary Key
            if (article) {
                res.json(article);
            } else {
                res.status(404).json({ error: 'Article not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // PUT: Update an article by ID
    router.put('/:id', async (req, res) => {
        try {
            const { title, author, content, summary, category, imageUrl, tags, publishedAt, views } = req.body;
            const article = await Article.findByPk(req.params.id);
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }
            article.title = title ?? article.title;
            article.author = author ?? article.author;
            article.content = content ?? article.content;
            article.summary = summary ?? article.summary;
            article.category = category ?? article.category;
            article.imageUrl = imageUrl ?? article.imageUrl;
            article.tags = tags ?? article.tags;
            article.publishedAt = publishedAt ?? article.publishedAt;
            if (typeof views === 'number') article.views = views;
            await article.save();
            res.json(article);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST: increment views
    router.post('/:id/view', async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) return res.status(404).json({ error: 'Article not found' });
            article.views += 1;
            await article.save();
            res.json({ views: article.views });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET: trending articles (by views)
    router.get('/_meta/trending', async (req, res) => {
        try {
            const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
            const trending = await Article.findAll({ order: [['views', 'DESC']], limit });
            res.json(trending);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET: categories list
    router.get('/_meta/categories', async (req, res) => {
        try {
            const rows = await Article.findAll({ attributes: ['category'], group: ['category'] });
            res.json(rows.map(r => r.category));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST: simple AI helpers - summarize and tags (mock, deterministic)
    router.post('/_ai/suggest', async (req, res) => {
        try {
            const { title = '', content = '' } = req.body || {};
            const plain = String(content).replace(/\s+/g, ' ').trim();
            const short = plain.length > 180 ? plain.slice(0, 177) + '...' : plain;
            const baseTags = [];
            if (/\b(ai|artificial intelligence|ml|machine learning)\b/i.test(plain)) baseTags.push('AI');
            if (/\b(js|javascript|react|node)\b/i.test(plain)) baseTags.push('JavaScript');
            if (/\b(startup|business|market|finance)\b/i.test(plain)) baseTags.push('Business');
            if (/\bscience|research|study\b/i.test(plain)) baseTags.push('Science');
            if (/\bhealth|medicine|medical\b/i.test(plain)) baseTags.push('Health');
            if (title) baseTags.push(...title.split(/[^a-zA-Z0-9]+/).filter(Boolean).slice(0, 3));
            const uniqueTags = Array.from(new Set(baseTags)).slice(0, 6).join(',');
            res.json({ summary: short, tags: uniqueTags });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE: Delete an article by ID
    router.delete('/:id', async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id);
            if (!article) {
                return res.status(404).json({ error: 'Article not found' });
            }
            await article.destroy();
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
    return router;
};