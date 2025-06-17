import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArticleEditor from './ArticleEditor';
import API_BASE from '../../API';

const ArticleLoader = () => {
    const { articleId } = useParams();
    const [articleData, setArticleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${API_BASE}/article/${articleId}`);
                setArticleData(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load article.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div>
            <ArticleEditor
                initialArticleData={articleData}
                onChange={(updatedArticle) => setArticleData(updatedArticle)}
            />
        </div>
    );
};

export default ArticleLoader;
