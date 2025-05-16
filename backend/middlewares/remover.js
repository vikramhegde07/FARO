import s3 from '../config/s3-config.js';

const deleteS3Files = async(req, res, next) => {
    try {
        const imageUrls = req.s3FilesToDelete;
        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            return next();
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const bucketUrl = `https://${bucketName}.s3.amazonaws.com/`;

        const validUrls = imageUrls.filter(url => typeof url === 'string' && url.startsWith(bucketUrl));

        if (!validUrls.length) return next();

        const s3Objects = validUrls.map(url => ({
            Key: url.replace(bucketUrl, '')
        }));

        await s3.deleteObjects({
            Bucket: bucketName,
            Delete: { Objects: s3Objects }
        }).promise();

        console.log(`✅ Deleted ${s3Objects.length} image(s) from S3`);
        next();
    } catch (err) {
        console.error('❌ Failed to delete S3 files:', err.message);
        return res.status(500).json({ message: 'Failed to delete files from S3' });
    }
};

export default deleteS3Files;