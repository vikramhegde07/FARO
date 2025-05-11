import s3 from '../config/s3-config.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * Uploads a single file buffer to AWS S3
 * @param {Buffer} buffer - The file buffer (e.g., from multer)
 * @param {String} folder - Folder path in S3 (e.g., 'articles', 'profiles')
 * @param {String} originalName - Original file name to get extension
 * @param {String} mimetype - File mimetype (e.g., 'image/png')
 * @returns {Object} - { url, key }
 */
export const uploadImageToS3 = async(buffer, folder, originalName, mimetype) => {
    const extension = path.extname(originalName);
    const filename = `${Date.now()}-${uuidv4()}${extension}`;
    const key = `${folder}/${filename}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    return {
        url: uploadResult.Location,
        key: uploadResult.Key,
    };
};