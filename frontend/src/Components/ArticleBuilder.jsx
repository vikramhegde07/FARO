import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArticlePreviewModal from './ArticlePreviewModal'; // Import the new component

const ArticleBuilder = () => {
    const [contentType, setContentType] = useState('heading');
    const [inputValue, setInputValue] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkHref, setLinkHref] = useState('');
    const [listItems, setListItems] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [currentTableRow, setCurrentTableRow] = useState('');
    const [articleStructure, setArticleStructure] = useState([]);
    const [relatedLinks, setRelatedLinks] = useState([]);
    const [fileUploads, setFileUploads] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [author, setAuthor] = useState('');
    const [authorLink, setAuthorLink] = useState('');
    const [tier, setTier] = useState('paid');
    const [blockClasses, setBlockClasses] = useState(''); // State for block classes
    const [showPreviewModal, setShowPreviewModal] = useState(false); // State for preview modal visibility

    const navigator = useNavigate();

    // Define available CSS classes for user selection
    const availableClasses = [
        { name: 'Text Center', class: 'text-center' },
        { name: 'Font Weight Bold', class: 'fw-bold' },
        { name: 'Italic Text', class: 'fst-italic' },
        { name: 'Text Color Red', class: 'text-danger' },
        { name: 'Text Color Blue', class: 'text-primary' },
        { name: 'Large Text', class: 'fs-3' }, // Using Bootstrap font size utility
        { name: 'Table Striped', class: 'table-striped' }, // Specific for tables
        { name: 'Table Dark', class: 'table-dark' }, // Specific for tables
    ];

    useEffect(() => {
        setTitle(localStorage.getItem('faro-title'));
        setIsland(localStorage.getItem('faro-island'));
        setTier(localStorage.getItem('faro-tier') || 'paid');
        setAuthor(localStorage.getItem('faro-author'));
        setAuthorLink(localStorage.getItem('faro-authorLink'));
    }, []);

    const handleAddContent = () => {
        let newBlock = {};
        if (contentType === 'points') {
            if (listItems.length === 0) {
                toast.error('Please add at least one list item.');
                return;
            }
            newBlock = { type: contentType, value: listItems, classes: blockClasses };
            setListItems([]);
        } else if (contentType === 'image') {
            if (!inputValue) { // inputValue here is the File object
                toast.error('Please select an image file.');
                return;
            }
            newBlock = { type: 'image', value: 'upload', classes: blockClasses };
            setFileUploads([...fileUploads, inputValue]);
        } else if (contentType === 'link') {
            if (!linkText || !linkHref) {
                toast.error('Please provide both link text and URL.');
                return;
            }
            newBlock = { type: contentType, value: { text: linkText, href: linkHref }, classes: blockClasses };
            setLinkText('');
            setLinkHref('');
        } else if (contentType === 'table') {
            if (tableRows.length === 0) {
                toast.error('Please add at least one table row.');
                return;
            }
            newBlock = { type: contentType, value: tableRows, classes: blockClasses };
            setTableRows([]);
        } else {
            if (!inputValue.trim()) {
                toast.error(`Please enter content for ${contentType}.`);
                return;
            }
            newBlock = { type: contentType, value: inputValue, classes: blockClasses };
        }

        if (editingIndex !== null) {
            const updatedStructure = [...articleStructure];
            updatedStructure[editingIndex] = newBlock;
            setArticleStructure(updatedStructure);
            setEditingIndex(null);
        } else {
            setArticleStructure([...articleStructure, newBlock]);
        }
        setInputValue('');
        setBlockClasses('');
        setContentType('heading'); // Reset content type after adding/updating
    };

    const handleDelete = (index) => {
        const updated = articleStructure.filter((_, i) => i !== index);
        setArticleStructure(updated);
        // Reset editing state if the deleted item was being edited
        if (editingIndex === index) {
            setEditingIndex(null);
            setInputValue('');
            setLinkText('');
            setLinkHref('');
            setListItems([]);
            setTableRows([]);
            setCurrentTableRow('');
            setBlockClasses('');
            setContentType('heading'); // Reset content type
        }
    };

    const handleEdit = (index) => {
        const item = articleStructure[index];
        setContentType(item.type);
        setBlockClasses(item.classes || '');

        if (item.type === 'points') {
            setListItems(item.value);
            setInputValue(''); // Clear input for new list items
        } else if (item.type === 'image') {
            setInputValue(null); // Image input handled by file selection
            // Note: When editing an image block, the original file is not re-selected automatically
            // The user would need to select a new image file if they want to change it.
        } else if (item.type === 'link') {
            setLinkText(item.value.text);
            setLinkHref(item.value.href);
        } else if (item.type === 'table') {
            setTableRows(item.value);
            setCurrentTableRow(''); // Clear input for new table rows
        } else {
            setInputValue(item.value);
        }
        setEditingIndex(index);
    };

    const moveContent = (index, direction) => {
        if (editingIndex !== null) {
            toast.warn('Please finish editing the current block before reordering.');
            return;
        }
        const newArticleStructure = [...articleStructure];
        const [movedItem] = newArticleStructure.splice(index, 1);
        if (direction === 'up' && index > 0) {
            newArticleStructure.splice(index - 1, 0, movedItem);
        } else if (direction === 'down' && index < newArticleStructure.length - 1) {
            newArticleStructure.splice(index + 1, 0, movedItem);
        }
        setArticleStructure(newArticleStructure);
    };

    const addListItem = () => {
        if (inputValue.trim()) {
            setListItems([...listItems, inputValue.trim()]);
            setInputValue('');
        } else {
            toast.error('List item cannot be empty.');
        }
    };

    const addTableRow = () => {
        if (currentTableRow.trim()) {
            setTableRows([...tableRows, currentTableRow.split(',').map(cell => cell.trim())]);
            setCurrentTableRow('');
        } else {
            toast.error('Table row cannot be empty.');
        }
    };

    const addRelatedLink = () => {
        if (linkText.trim() && linkHref.trim()) {
            setRelatedLinks([...relatedLinks, { linkText: linkText.trim(), linkAddr: linkHref.trim() }]);
            setLinkText('');
            setLinkHref('');
        } else {
            toast.error('Please provide both link text and URL for related link.');
        }
    };

    const handleAddClass = (cssClass) => {
        // Prevent adding duplicate classes
        if (!blockClasses.split(' ').includes(cssClass)) {
            setBlockClasses((prevClasses) =>
                prevClasses ? `${prevClasses} ${cssClass}` : cssClass
            );
        }
    };

    const handleRemoveClass = (cssClass) => {
        setBlockClasses((prevClasses) =>
            prevClasses
                .split(' ')
                .filter((c) => c !== cssClass)
                .join(' ')
        );
    };

    const handleSubmitArticle = async () => {
        if (!title || !island || !tier) {
            toast.error('Please ensure Title, Island, and Tier are set for the article.');
            return;
        }
        if (articleStructure.length === 0) {
            toast.error('Article content cannot be empty.');
            return;
        }

        const formData = new FormData();
        const updatedContent = [];
        let imageFilesForUpload = []; // To hold the actual File objects for image blocks

        // Process article structure for content and image files
        for (const block of articleStructure) {
            if (block.type === 'image' && block.value === 'upload') {
                // Find the corresponding File object from fileUploads for this image block
                // This logic assumes fileUploads are pushed in the order image blocks are added
                // A more robust solution might involve unique IDs for file inputs or a map.
                const imageFile = fileUploads.shift(); // Remove from front to ensure correct mapping
                if (imageFile) {
                    formData.append('images', imageFile);
                    updatedContent.push({ type: 'image', value: `image_placeholder_${imageFilesForUpload.length}`, classes: block.classes });
                    imageFilesForUpload.push(imageFile); // Keep track for potential re-indexing if needed
                } else {
                    toast.error('An image block is missing its corresponding file.');
                    return; // Prevent submission if files are missing
                }
            } else {
                updatedContent.push(block);
            }
        }

        const authorData = {
            authorName: author,
            linkToProfile: authorLink
        }

        formData.append('title', title);
        formData.append('island', island);
        formData.append('tier', tier);
        formData.append('author', JSON.stringify(authorData));
        formData.append('content', JSON.stringify(updatedContent));
        formData.append('relatedLinks', JSON.stringify(relatedLinks));

        console.log(updatedContent);

        try {
            const res = await axios.post(`${API_BASE}/article/create/builder`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('faro-user')
                }
            });
            toast.success('Article submitted!');
            localStorage.removeItem('faro-title');
            localStorage.removeItem('faro-island');
            localStorage.removeItem('faro-tier');
            localStorage.removeItem('faro-author');
            localStorage.removeItem('faro-authorLink');
            navigator('/account');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit article");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Article Builder</h2>
            <div className="row mt-4">
                <div className="col-md-6">
                    <h4>Content Blocks</h4>
                    <div className="mb-3">
                        {articleStructure.map((item, index) => (
                            <div key={index} className="border p-2 mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{item.type.toUpperCase()}:</strong>
                                        {item.type === 'image' ? (
                                            <p>Image block</p>
                                        ) : item.type === 'points' ? (
                                            <ul>
                                                {item.value.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        ) : item.type === 'link' ? (
                                            <p>
                                                <a href={item.value.href} target="_blank" rel="noopener noreferrer">
                                                    {item.value.text}
                                                </a>
                                            </p>
                                        ) : item.type === 'table' ? (
                                            <p>Table block ({item.value.length} rows)</p>
                                        ) : (
                                            <p>{item.value}</p>
                                        )}
                                        {item.classes && <small className="text-muted d-block mt-1">Classes: `{item.classes}`</small>}
                                    </div>
                                    <div className="d-flex flex-column align-items-end">
                                        <div className="mb-2">
                                            <button
                                                className="btn btn-sm btn-dark me-2 rounded-0"
                                                onClick={() => moveContent(index, 'up')}
                                                disabled={index === 0 || editingIndex !== null}
                                            >
                                                <ion-icon name="arrow-up-outline" ></ion-icon>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-dark rounded-0"
                                                onClick={() => moveContent(index, 'down')}
                                                disabled={index === articleStructure.length - 1 || editingIndex !== null}
                                            >
                                                <ion-icon name="arrow-down-outline" ></ion-icon>
                                            </button>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm btn-warning me-2 rounded-0" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="btn btn-sm btn-danger rounded-0" onClick={() => handleDelete(index)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />

                    <div className="mb-3">
                        <label htmlFor="contentType" className="form-label">Select Content Type</label>
                        <select
                            className="form-select mb-2"
                            name='contentType'
                            id='contentType'
                            value={contentType}
                            onChange={(e) => {
                                setContentType(e.target.value);
                                setInputValue('');
                                setLinkText('');
                                setLinkHref('');
                                setListItems([]);
                                setTableRows([]);
                                setCurrentTableRow('');
                                setEditingIndex(null); // Clear editing when changing type
                                setBlockClasses(''); // Clear classes when changing type
                            }}
                        >
                            <option value="heading">Heading</option>
                            <option value="subheading">Subheading</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="points">Points (List)</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                            <option value="table">Table</option>
                        </select>
                    </div>



                    {contentType === 'image' ? (
                        <div className='mb-3'>
                            <label htmlFor="imgSelect" className='form-label'>Select Image</label>
                            <input
                                type="file"
                                id='imgSelect'
                                name='imgSelect'
                                className="form-control mb-2"
                                onChange={(e) => setInputValue(e.target.files[0])}
                                accept="image/*"
                            />
                            <p className="text-danger">*Resize or crops images before uploading to avoid image overflows</p>
                        </div>
                    ) : contentType === 'link' ? (
                        <>
                            <div className="mb-3">
                                <label htmlFor="linkText" className='form-label'>Text for the Link</label>
                                <input
                                    type="text"
                                    name='linkText'
                                    id='linkText'
                                    className="form-control mb-2"
                                    placeholder="Link Text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="linkURL" className='form-label'>Address (URL) for the link</label>
                                <input
                                    type="text"
                                    name='linkURL'
                                    id='linkURL'
                                    className="form-control mb-2"
                                    placeholder="Link Address (URL)"
                                    value={linkHref}
                                    onChange={(e) => setLinkHref(e.target.value)}
                                />
                            </div>
                        </>
                    ) : contentType === 'points' ? (
                        <>
                            <input
                                type="text"
                                name='listItemInput'
                                id='listItemInput'
                                className="form-control mb-2"
                                placeholder="Enter list item"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addListItem();
                                    }
                                }}
                            />
                            <button className="btn btn-secondary mb-2" onClick={addListItem} disabled={!inputValue.trim()}>Add List Item</button>
                            {listItems.length > 0 && (
                                <ul className="list-group mb-2">
                                    {listItems.map((item, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            {item}
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setListItems(listItems.filter((_, i) => i !== idx))}>x</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : contentType === 'table' ? (
                        <>
                            <input
                                type="text"
                                name='tableRowInput'
                                id='tableRowInput'
                                className="form-control mb-2"
                                placeholder="Enter row (comma-separated values, e.g., cell1,cell2)"
                                value={currentTableRow}
                                onChange={(e) => setCurrentTableRow(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTableRow();
                                    }
                                }}
                            />
                            <button className="btn btn-secondary mb-2" onClick={addTableRow} disabled={!currentTableRow.trim()}>Add Table Row</button>
                            {tableRows.length > 0 && (
                                <table className="table table-bordered mb-2">
                                    <thead>
                                        <tr>
                                            {/* Render dynamic headers based on the longest row for display purposes */}
                                            {Array.from({ length: Math.max(...tableRows.map(row => row.length), 0) }).map((_, i) => (
                                                <th key={i}>Column {i + 1}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableRows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex}>{cell}</td>
                                                ))}
                                                {/* Add empty cells if rows have different lengths */}
                                                {row.length < Math.max(...tableRows.map(r => r.length), 0) &&
                                                    Array.from({ length: Math.max(...tableRows.map(r => r.length), 0) - row.length }).map((_, i) => (
                                                        <td key={`empty-${rowIndex}-${i}`}></td>
                                                    ))
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    ) : (
                        <textarea
                            className="form-control mb-2"
                            name='textInput'
                            id='textInput'
                            placeholder={`Enter ${contentType}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows={contentType === 'paragraph' ? 5 : 1}
                        ></textarea>
                    )}

                    {/* Class Selection Buttons */}
                    <div className="mb-3">
                        <label htmlFor="blockClasses" className="form-label">Apply Effects</label>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {availableClasses.map((cls, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`btn btn-sm  ${blockClasses.includes(cls.class) ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => handleAddClass(cls.class)}
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                        {blockClasses && (
                            <div className="mb-2">
                                <strong>Applied Classes:</strong>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {blockClasses.split(' ').map((cls, idx) => (
                                        cls && (
                                            <span key={idx} className="badge bg-primary d-flex align-items-center">
                                                {cls}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-1"
                                                    aria-label="Remove"
                                                    onClick={() => handleRemoveClass(cls)}
                                                ></button>
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary rounded-0 px-4" onClick={handleAddContent} disabled={
                            (contentType === 'link' && (!linkText.trim() || !linkHref.trim())) ||
                            (contentType === 'points' && listItems.length === 0 && !inputValue.trim()) ||
                            (contentType === 'table' && tableRows.length === 0 && !currentTableRow.trim()) ||
                            ((contentType !== 'points' && contentType !== 'link' && contentType !== 'table' && contentType !== 'image') && !inputValue.trim()) ||
                            (contentType === 'image' && !inputValue)
                        }>
                            {editingIndex !== null ? 'Update Block' : 'Add to Article'}
                        </button>
                    </div>

                    <hr />

                    <h5>Related Links</h5>
                    <div className="mb-3">
                        <input type="text" className="form-control mb-2" placeholder="Link Text" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
                        <input type="text" className="form-control mb-2" placeholder="Link URL" value={linkHref} onChange={(e) => setLinkHref(e.target.value)} />
                        <button className="btn btn-dark rounded-0 px-4" onClick={addRelatedLink} disabled={!linkText.trim() || !linkHref.trim()}>Add Related Link</button>
                    </div>
                    <ul>
                        {relatedLinks.map((link, idx) => (
                            <li key={idx} className="d-flex justify-content-between align-items-center">
                                <a href={link.linkAddr} target="_blank" rel="noreferrer">{link.linkText}</a>
                                <button className="btn btn-sm btn-outline-danger rounded-0" onClick={() => setRelatedLinks(relatedLinks.filter((_, i) => i !== idx))}>x</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-md-6">
                    <h4>Current Article Progress</h4>
                    <p className="text-muted">This section just shows the block types. Use the 'Show Preview' button for the full rendering.</p>
                    <div className="border p-3">
                        {articleStructure.length === 0 ? (
                            <p className="text-center text-muted">Start adding content blocks to see them here.</p>
                        ) : (
                            articleStructure.map((item, index) => (
                                <div key={index} className="p-1 mb-1 bg-light border-bottom">
                                    <strong>{item.type.toUpperCase()} Block</strong>
                                    {item.classes && <span className="ms-2 badge bg-info">Classes: {item.classes}</span>}
                                    {item.type === 'paragraph' || item.type === 'heading' || item.type === 'subheading' ? (
                                        <span className="ms-2 text-muted text-truncate d-inline-block" style={{ maxWidth: 'calc(100% - 150px)' }}>{item.value}</span>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <button className="btn btn-primary btn-lg rounded-0 px-4" onClick={() => setShowPreviewModal(true)}>Show Full Article Preview</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="d-flex justify-content-center gap-3 p-3">
                <button className="btn btn-danger px-4 rounded-0" onClick={() => navigator('/account')}>Cancel</button>
                <button className="btn btn-success px-4 rounded-0" onClick={handleSubmitArticle}>Publish Article</button>
            </div>

            {/* Article Preview Modal */}
            <ArticlePreviewModal
                show={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                articleStructure={articleStructure}
                fileUploads={fileUploads}
                relatedLinks={relatedLinks}
            />
        </div>
    );
};

export default ArticleBuilder;