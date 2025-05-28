import React from 'react';

const ArticlePreviewModal = ({ show, onClose, articleStructure, fileUploads, relatedLinks }) => {
    if (!show) {
        return null;
    }

    const renderBlock = (item, index) => {
        switch (item.type) {
            case 'heading': return <h2 key={index} className={item.classes}>{item.value}</h2>;
            case 'subheading': return <h4 key={index} className={item.classes}>{item.value}</h4>;
            case 'paragraph': return <p key={index} className={item.classes}>{item.value}</p>;
            case 'points': return <ul key={index} className={item.classes}>{item.value.map((pt, i) => <li key={i}>{pt}</li>)}</ul>;
            case 'link': return <a key={index} href={item.value.href} target="_blank" rel="noopener noreferrer" className={item.classes}>{item.value.text}</a>;
            case 'image':
                // Find the correct image file for preview
                const imgFileIndex = articleStructure
                    .slice(0, index)
                    .filter(b => b.type === 'image' && b.value === 'upload')
                    .length;
                const imageFile = fileUploads[imgFileIndex];
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
                            <p>Image placeholder (file not loaded for preview)</p>
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
            <div className="d-flex flex-column bg-white p-3 w-75" onClick={e => e.stopPropagation()}>
                <div className="flex-jbetween">
                    <h5 className="fw-semibold fs-3">Article Preview</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <hr />
                <div className="">
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
                <div className="flex-jend">
                    <button type="button" className="btn btn-dark rounded-0 px-3" onClick={onClose}>Close Preview</button>
                </div>
            </div>
        </div>
    );
};

export default ArticlePreviewModal;