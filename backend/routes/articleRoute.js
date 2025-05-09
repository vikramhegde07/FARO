import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { Article } from '../models/articleModel.js';
import { Subsription } from '../models/subsriptionModel.js';

const router = express.Router();

// 📝 Create Article (with optional image upload)
router.post('/create/parser', auth, upload.single('image'), async(req, res) => {
    try {
        const { title, island, tier, approval, content } = req.body;

        if (!title || !island || !content) {
            return res.status(404).json({
                error: 'Send All fields'
            });
        }

        const article = new Article({
            title,
            author: req.userId,
            island,
            tier: tier || 'paid',
            approval: approval || false,
            content,
        });

        const saved = await article.save();
        return res.status(201).json(saved);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.post('/create/builder', auth, upload.single('image'), async(req, res) => {
    try {
        const { title, island, tier, approval, content } = req.body;

        if (!title || !island || !content) {
            return res.status(404).json({
                error: 'Send All fields'
            });
        }

        const article = new Article({
            title,
            author: req.userId,
            island,
            tier: tier || 'paid',
            approval: approval || false,
            content: JSON.parse(content),
        });

        const saved = await article.save();
        return res.status(201).json(saved);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// Express endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    return res.json({ url: imagePath });
});

// 📥 Get All Articles
router.get('/', async(req, res) => {
    try {
        const articles = await Article.find().populate('author').populate('island');
        return res.status(200).json(articles);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 📥 Get Article by ID
router.get('/:id', async(req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author').populate('island');
        if (!article)
            return res.status(404).json({ error: 'Article not found' });
        return res.status(200).json(article);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 🛠 Update Article
router.put('/:id', auth, upload.single('image'), async(req, res) => {
    try {
        const updatedFields = {
            ...req.body,
            content: req.body.content ? JSON.parse(req.body.content) : undefined,
            image: req.file ? req.file.path : undefined,
        };

        const updated = await Article.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// 🗑 Delete Article
router.delete('/:id', auth, async(req, res) => {
    try {
        const deleted = await Article.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Article not found' });
        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 🌍 Get Articles by Island
router.get('/island/:islandId', async(req, res) => {
    try {
        const articles = await Article.find({ island: req.params.islandId }).populate('author');
        return res.status(200).json(articles);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ✅ Approve Article
router.patch('/approve/:id', auth, async(req, res) => {
    try {
        const approved = await Article.findByIdAndUpdate(req.params.id, { approval: true }, { new: true });
        return res.status(200).json(approved);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;