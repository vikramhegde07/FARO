import express from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { uploadImageToS3 } from '../controllers/uploadController.js';
import { Article } from '../models/articleModel.js';
import { ArticleReview } from '../models/articleReview.js';
import deleteS3Files from '../middlewares/remover.js';
import { removeArticleReviews } from '../controllers/articleReview.js';


const router = express.Router();

// 📝 Create Article (with optional image upload)
router.post('/create/parser', auth, upload.array('images'), async(req, res) => {
    try {
        const { title, island, tier, approval, articleType } = req.body;
        let { content, author } = req.body;

        // Validate required fields
        if (!title || !island || !content || !author) {
            return res.status(400).json({
                error: 'Please provide title, island, content, and authorName.'
            });
        }

        // Parse content if it's sent as a JSON string
        if (typeof content === 'string') content = JSON.parse(content);
        if (typeof author === 'string') author = JSON.parse(author);

        // Validate content format
        if (!Array.isArray(content)) {
            return res.status(400).json({ message: 'Invalid content format' });
        }

        // Handle uploaded images
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

        // Replace 'upload' placeholders in image blocks with actual URLs
        let imageIndex = 0;
        content = content.map((block) => {
            if (block.type === 'image' && block.value === 'upload') {
                const url = uploadedImages[imageIndex++];
                return {
                    ...block,
                    value: url
                };
            }
            return block;
        });

        // Construct the article object
        const article = new Article({
            title,
            author: author,
            island,
            tier: tier || 'paid',
            articleType,
            approval: approval || false,
            content
        });

        // Save and respond
        const saved = await article.save();
        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
});

//Create article with builder method
router.post('/create/builder', auth, upload.array('images'), async(req, res) => {
    try {
        const { title, island, tier, approval, articleType } = req.body;
        let { content, author, relatedLinks } = req.body;

        // Validate required fields
        if (!title || !island || !content || !author) {
            return res.status(400).json({
                error: 'Please provide title, island, content, and authorName.'
            });
        }

        // Parse content if it's sent as a JSON string
        if (typeof content === 'string') content = JSON.parse(content);
        if (typeof author === 'string') author = JSON.parse(author);
        if (typeof relatedLinks === 'string') relatedLinks = JSON.parse(relatedLinks);

        // Validate content format
        if (!Array.isArray(content)) {
            return res.status(400).json({ message: 'Invalid content format' });
        }

        // Handle uploaded images
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

        // Replace 'upload' placeholders in image blocks with actual URLs
        let imageIndex = 0;
        content = content.map((block) => {
            if (block.type === 'image' && block.value === 'upload') {
                const url = uploadedImages[imageIndex++];
                return {
                    ...block,
                    value: url
                };
            }
            return block;
        });

        // Construct the article object
        const article = new Article({
            title,
            author: author,
            island,
            tier: tier || 'paid',
            approval: approval || false,
            content,
            articleType,
            relatedLinks
        });

        // Save and respond
        const saved = await article.save();
        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
});

// Express endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    return res.json({ url: imagePath });
});

// GET /api/admin/articles-categorized
router.get('/articles-categorized', async(req, res) => {
    try {
        // Get all articles
        const allArticles = await Article.find().populate('island').lean().sort({ createdAt: -1 });

        // Get all reviews to match with articles
        const allReviews = await ArticleReview.find().select('articleId').lean();
        const reviewedArticleIds = new Set(allReviews.map(review => review.articleId.toString()));

        const approvedArticles = [];
        const approvalPendingArticles = [];
        const reviewPendingArticles = [];

        for (const article of allArticles) {
            if (article.approval) {
                approvedArticles.push(article);
            } else {

                // If article has no review
                if (!reviewedArticleIds.has(article._id.toString())) {
                    reviewPendingArticles.push(article);
                } else {
                    approvalPendingArticles.push(article);
                }
            }
        }

        res.status(200).json({
            approvedArticles,
            approvalPendingArticles,
            reviewPendingArticles
        });
    } catch (error) {
        console.error('Error fetching categorized articles:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
router.put('/update/:id', upload.array('images'), async(req, res, next) => {
    try {
        const { id } = req.params;
        const { title, island, tier, content, author, relatedLinks } = req.body;

        const article = await Article.findById(id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const parsedContent = JSON.parse(content);
        const parsedAuthor = JSON.parse(author);
        const parsedRelatedLinks = JSON.parse(relatedLinks);

        console.log(island);

        // Step 1: Track old and retained image URLs
        const oldImageUrls = article.content
            .filter(block => block.type === 'image')
            .map(block => block.value);

        const retainedImageUrls = parsedContent
            .filter(block => block.type === 'image' && !block.value.startsWith('image_placeholder_'))
            .map(block => block.value);

        // Step 2: Determine S3 images to delete
        const imagesToDelete = oldImageUrls.filter(url => !retainedImageUrls.includes(url));
        req.s3FilesToDelete = imagesToDelete;

        // Step 3: Upload new images and map placeholders
        const newImageFiles = req.files;
        let uploadIndex = 0;

        const finalContent = await Promise.all(parsedContent.map(async(block) => {
            if (block.type === 'image' && block.value.startsWith('image_placeholder_')) {
                const file = newImageFiles[uploadIndex++];
                const uploaded = await uploadImageToS3(file.buffer, 'articles', file.originalname, file.mimetype);
                return {...block, value: uploaded.url };
            }
            return block;
        }));

        // Step 4: Update article
        article.title = title;
        article.island = island;
        article.tier = tier;
        article.author = parsedAuthor;
        article.relatedLinks = parsedRelatedLinks;
        article.content = finalContent;

        await article.save();

        // Step 5: Continue to S3 deletion middleware
        next();

    } catch (err) {
        console.error('❌ Article update error:', err.message);
        res.status(500).json({ message: 'Failed to update article' });
    }
}, deleteS3Files, (req, res) => {
    res.status(200).json({ message: '✅ Article updated and old images deleted successfully.' });
});

//Delete Article
router.delete('/articleId/:id', auth, async(req, res, next) => {
    const articleId = req.params.id;
    try {

        const articleData = await Article.findById(articleId);

        if (!articleData) return res.status(403).json({ error: "Sorry no article found" });
        req.s3FilesToDelete = articleData.content
            .filter(block => block.type === 'image')
            .map(block => block.value);

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}, deleteS3Files, async(req, res) => {
    await removeArticleReviews(req.params.id);
    await Article.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Article removed." })
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