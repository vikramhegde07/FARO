import axios from 'axios';
import React, { useEffect, useState } from 'react';
import API_BASE from '../API';
import { useLoading } from '../Context/LoadingContext';

// Helper function to render article content blocks (no change needed here)
const renderArticleContent = (item, idx) => {
    switch (item.type) {
        case 'paragraph':
            return <p>{item.value}</p>;
        case 'heading':
            return <h1>{item.value}</h1>;
        case 'subheading':
            return <h3>{item.value}</h3>;
        case 'image':
            return (
                <div className='flex-center'>
                    <img src={item.value} alt="article" className='img-fluid' style={{ maxWidth: '600px' }} />
                </div>
            );
        case 'link':
            return (
                <a href={item.value.href} target="_blank" rel="noopener noreferrer" className='d-block'>
                    {item.value.text}
                </a>
            );
        case 'points':
            return (
                <ul className='ps-4'>
                    {item.value.items.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            );
        case 'table':
            return (
                <div className="table-responsive overflow-y-scroll my-3">
                    <table className="table table-bordered">
                        <tbody>
                            {item.value.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'code':
            return (
                <pre className="bg-light p-3 rounded overflow-y-scroll" style={{ maxHeight: "60vh" }}>
                    <code>{item.value.code}</code>
                </pre>
            );
        default:
            return null;
    }
};

function ReviewDisplayModal({ article, close }) {
    const [articleReviews, setArticleReviews] = useState([]); // This will now hold full review documents
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (article && article._id) {
            fetchArticleReviews(article._id);
        }
    }, [article]);

    const fetchArticleReviews = async (articleId) => {
        showLoading();
        try {
            // Your API endpoint (you'll confirm this later)
            // It should return an array of ArticleReview documents.
            // Each ArticleReview document should have userId populated, and content should be an array.
            const response = await axios.get(`${API_BASE}/review/article/${articleId}`);
            setArticleReviews(response.data);
            console.log("Fetched Reviews:", response.data);
        } catch (error) {
            console.error('Error fetching article reviews:', error.response ? error.response.data : error.message);
            alert('Failed to load reviews.');
        } finally {
            hideLoading();
        }
    };

    const getCommentsForIndex = (targetIndex) => {
        const comments = [];
        articleReviews.forEach(reviewDoc => {
            // Check if reviewDoc.content is an array and iterate through it
            if (Array.isArray(reviewDoc.content)) {
                reviewDoc.content.forEach(commentObj => {
                    if (commentObj.index === targetIndex) {
                        comments.push({
                            reviewerUsername: reviewDoc.userId ? reviewDoc.userId.username : 'Unknown User',
                            comment: commentObj.comment,
                            createdAt: reviewDoc.createdAt // Use the createdAt of the main review document
                        });
                    }
                });
            }
        });
        return comments;
    };

    if (!article) return null;

    return (
        <div className="my-modal">
            <div className="container bg-white overflow-y-scroll p-3" style={{ maxHeight: '95vh' }}>
                <div className="modal-content px-2 py-3">
                    <div className="flex-jbetween">
                        <h5 className="fw-semibold fs-3">Reviews for: {article.title}</h5>
                        <button type="button" className="btn-close" onClick={close}></button>
                    </div>
                    <hr />
                    <div className="modal-body p-4">
                        {/* Article Content Display */}
                        <div className='flex-acenter gap-2 mb-3'>
                            <img src="/assets/img/Logo.jpg" alt="Logo" className="img-fluid" width={30} />
                            <h1 className='fs-4 text-center text-semibold'>{article.title}</h1>
                        </div>
                        {article.author && article.author.authorName && (
                            <div className="flex-jend mb-3">
                                <p className='text-black-50 m-0'>- Article by {article.author.authorName}</p>
                            </div>
                        )}

                        {/* Render article content and associated reviews */}
                        {article.content.map((item, idx) => {
                            const commentsForThisSection = getCommentsForIndex(idx);
                            return (
                                <div key={item._id || idx} className={`position-relative mb-4 ${item.classes}`}>
                                    {renderArticleContent(item, idx)}

                                    {/* Display Comments for this section */}
                                    {commentsForThisSection.length > 0 && (
                                        <div className="mt-3 p-3 bg-info-subtle border rounded">
                                            <h6 className="fw-semibold">Comments for this section:</h6>
                                            {commentsForThisSection.map((comment, commentIdx) => ( // Renamed review to comment here
                                                <div key={commentIdx} className="mb-2 pb-2 border-bottom">
                                                    <p className="m-0 fw-bold text-primary">
                                                        {comment.reviewerUsername} says:
                                                    </p>
                                                    <p className="m-0 text-break">{comment.comment}</p>
                                                    <small className="text-muted">
                                                        Reviewed on: {new Date(comment.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {article.relatedLinks.length > 0 && (
                            <>
                                <hr />
                                <div className='bg-light p-3'>
                                    <h2 className="fw-semibold mb-3">Related Links</h2>
                                    <ul>
                                        {article.relatedLinks.map((link, index) => (
                                            <li key={index}>
                                                <a href={link.linkAddr} target='_blank' rel="noopener noreferrer">
                                                    {link.linkText}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    <hr />
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-dark rounded-0 px-4"
                            onClick={close}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewDisplayModal;