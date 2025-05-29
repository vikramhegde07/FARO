import React from 'react';

const ArticlePreviewModal = ({ show, onClose, articleStructure, fileUploads, relatedLinks, existingImageUrls }) => {
    if (!show) {
        return null;
    }

    const renderBlock = (item, index) => {
        switch (item.type) {
            case 'heading': return <h2 key={index} className={item.classes}>{item.value}</h2>;
            case 'subheading': return <h4 key={index} className={item.classes}>{item.value}</h4>;
            case 'paragraph': return <p key={index} className={item.classes}>{item.value}</p>;
            case 'points':
                // Check if item.value is an object with listType and items
                if (item.value && typeof item.value === 'object' && item.value.items) {
                    const ListTag = item.value.listType === 'ol' ? 'ol' : 'ul';
                    return (
                        <ListTag key={index} className={item.classes}>
                            {item.value.items.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ListTag>
                    );
                }
                // Fallback for old structure or malformed data if necessary
                return <ul key={index} className={item.classes}>{Array.isArray(item.value) ? item.value.map((pt, i) => <li key={i}>{pt}</li>) : <li>{item.value}</li>}</ul>;
            case 'link': return <a key={index} href={item.value.href} target="_blank" rel="noopener noreferrer" className={item.classes}>{item.value.text}</a>;
            case 'image':
                // Prioritize existingImageUrls if available for the block's index
                if (existingImageUrls && existingImageUrls[index]) {
                    return (
                        <div key={index} className={item.classes}>
                            <img
                                src={existingImageUrls[index]}
                                alt="article content"
                                className="img-fluid"
                            />
                        </div>
                    );
                }

                // If not an existing image, check fileUploads (for newly added images before submission)
                const imageFile = fileUploads[index]; // fileUploads are now keyed by their final index in articleStructure
                const previewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

                return (
                    <div key={index} className={item.classes}>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="img-fluid"
                            />
                        ) : (
                            <p>Image placeholder (file not loaded for preview or no existing image URL)</p>
                        )}
                    </div>
                );
            case 'table':
                return (
                    <table key={index} className={`table table-bordered ${item.classes}`}>
                        <tbody>
                            {item.value.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default: return null;
        }
    };

    return (
        <div className="my-modal" onClick={onClose}>
            <div className="bg-white p-3 w-75 my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex-jbetween">
                    <h5 className="fw-semibold fs-3">Article Preview</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <hr />
                <div className="overflow-y-scroll" style={{ maxHeight: '70vh' }}>
                    {articleStructure.length === 0 && <p className="text-muted text-center">No content added yet for preview.</p>}
                    {articleStructure.map((item, index) => renderBlock(item, index))}

                    {relatedLinks.length > 0 && (
                        <>
                            <h5 className="mt-4">Related Links</h5>
                            <ul>
                                {relatedLinks.map((link, idx) => (
                                    <li key={idx}><a href={link.linkAddr} target="_blank" rel="noreferrer">{link.linkText}</a></li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
                <hr />
                <div className="flex-jend">
                    <button type="button" className="btn btn-dark rounded-0 px-3" onClick={onClose}>Close Preview</button>
                </div>
            </div>
        </div>
    );
};

export default ArticlePreviewModal;