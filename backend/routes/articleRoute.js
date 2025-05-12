import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { Article } from '../models/articleModel.js';
import { uploadImageToS3 } from '../controllers/uploadController.js';

const router = express.Router();

// 📝 Create Article (with optional image upload)
router.post('/create/parser', auth, upload.array('images'), async(req, res) => {
    try {
        const { title, island, tier, approval } = req.body;
        let { content } = req.body;
        if (!title || !island || !content) {
            return res.status(404).json({
                error: 'Send All fields'
            });
        }

        if (typeof content === 'string') {
            content = JSON.parse(content);
        }

        if (!Array.isArray(content)) {
            return res.status(400).json({ message: 'Invalid content format' });
        }

        // Process images in content blocks
        const uploadedImages = [];

        for (const file of req.files) {
            const { url } = await uploadImageToS3(
                file.buffer,
                'articles',
                file.originalname,
                file.mimetype
            );
            uploadedImages.push(url);
        }

        // Replace placeholders in content
        let imageIndex = 0;
        content = content.map((block) => {
            if (block.type === 'image' && block.value === 'upload') {
                const url = uploadedImages[imageIndex++];
                return {...block, value: url };
            }
            return block;
        });

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

router.post('/create/builder', auth, upload.array('images'), async(req, res) => {
    try {
        const { title, island, tier, approval, content, relatedLinks, relatedFiles } = req.body;

        if (!title || !island || !content) {
            return res.status(400).json({ error: 'Send all required fields' });
        }

        // Parse stringified fields
        const parsedContent = JSON.parse(content);
        const parsedRelatedLinks = JSON.parse(relatedLinks || '[]');
        const parsedRelatedFiles = JSON.parse(relatedFiles || '[]');

        // Upload image files and replace 'upload' with actual S3/local URLs
        const updatedContent = [];
        let imageIndex = 0;

        for (let block of parsedContent) {
            if (block.type === 'image' && block.value === 'upload') {
                const file = req.files[imageIndex];
                const uploadedUrl = await uploadImageToS3(file, 'articles/images');
                updatedContent.push({ type: 'image', value: uploadedUrl });
                imageIndex++;
            } else {
                updatedContent.push(block);
            }
        }

        // Upload related files
        const totalImages = imageIndex;
        const uploadedFiles = [];

        for (let i = totalImages; i < req.files.length; i++) {
            const file = req.files[i];
            const fileUrl = await uploadImageToS3(file, 'articles/files');
            uploadedFiles.push(fileUrl);
        }

        // Replace 'upload' in relatedFiles with actual URLs
        const finalizedRelatedFiles = parsedRelatedFiles.map((file, idx) => ({
            fileName: file.fileName,
            linkToFile: uploadedFiles[idx] || ''
        }));

        const newArticle = new Article({
            title,
            author: req.userId,
            island,
            tier: tier || 'paid',
            approval: approval || false,
            content: updatedContent,
            relatedLinks: parsedRelatedLinks,
            relatedFiles: finalizedRelatedFiles,
        });

        const savedArticle = await newArticle.save();
        return res.status(201).json(savedArticle);
    } catch (err) {
        console.error('Error creating article:', err);
        return res.status(500).json({ message: err.message });
    }
});


// Express endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    return res.json({ url: imagePath });
});

//Get All Articles
router.get('/', async(req, res) => {
    try {
        const articles = await Article.find().populate('author').populate('island');
        return res.status(200).json(articles);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//Get Article by ID
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

//Update Article
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

//Delete Article
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