import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../API';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import ArticlePreviewModal from '../../Components/ArticlePreviewModal';

const ArticleBuilder = ({ initialArticleData }) => { // Accept initialArticleData prop
    const [contentType, setContentType] = useState('heading');
    const [inputValue, setInputValue] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkHref, setLinkHref] = useState('');
    const [listItems, setListItems] = useState([]);
    const [listType, setListType] = useState('ul'); // New state for list type
    const [tableRows, setTableRows] = useState([]);
    const [currentTableRow, setCurrentTableRow] = useState('');
    const [articleStructure, setArticleStructure] = useState([]);
    const [relatedLinks, setRelatedLinks] = useState([]);
    const [fileUploads, setFileUploads] = useState({}); // Use an object to store files by block index
    const [editingIndex, setEditingIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [author, setAuthor] = useState('');
    const [authorLink, setAuthorLink] = useState('');
    const [tier, setTier] = useState('paid');
    const [blockClasses, setBlockClasses] = useState('');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [existingImageUrls, setExistingImageUrls] = useState({}); // To store URLs of existing images

    const navigator = useNavigate();
    const { articleId } = useParams(); // Get articleId from URL for editing

    const availableClasses = [
        { name: 'Text Center', class: 'text-center' },
        { name: 'Font Weight Bold', class: 'fw-bold' },
        { name: 'Italic Text', class: 'fst-italic' },
        { name: 'Text Color Red', class: 'text-danger' },
        { name: 'Text Color Blue', class: 'text-primary' },
        { name: 'Large Text', class: 'fs-3' },
        { name: 'Table Striped', class: 'table-striped' },
        { name: 'Table Dark', class: 'table-dark' },
    ];

    useEffect(() => {
        if (initialArticleData) {
            // Populate state from initialArticleData when editing an existing article
            setTitle(initialArticleData.title);
            setIsland(initialArticleData.island);
            setTier(initialArticleData.tier);
            setAuthor(initialArticleData.author.authorName);
            setAuthorLink(initialArticleData.author.linkToProfile);
            setArticleStructure(initialArticleData.content);
            setRelatedLinks(initialArticleData.relatedLinks);

            // Populate existingImageUrls for image blocks
            const imageUrls = {};
            initialArticleData.content.forEach((block, index) => {
                if (block.type === 'image') {
                    imageUrls[index] = block.value; // block.value will be the URL for existing images
                } else if (block.type === 'points' && block.value.listType) { // Set listType when editing
                    setListType(block.value.listType);
                }
            });
            setExistingImageUrls(imageUrls);

        } else {
            // Load from localStorage for new articles
            setTitle(localStorage.getItem('faro-title') || '');
            setIsland(localStorage.getItem('faro-island') || '');
            setTier(localStorage.getItem('faro-tier') || 'paid');
            setAuthor(localStorage.getItem('faro-author') || '');
            setAuthorLink(localStorage.getItem('faro-authorLink') || '');
        }
    }, [initialArticleData]);

    const handleAddContent = () => {
        let newBlock = {};
        if (contentType === 'points') {
            if (listItems.length === 0) {
                toast.error('Please add at least one list item.');
                return;
            }
            // Modified to store listType and items
            newBlock = { type: contentType, value: { listType: listType, items: listItems }, classes: blockClasses };
            setListItems([]);
            setListType('ul'); // Reset to default after adding
        } else if (contentType === 'image') {
            // For images, we will temporarily use 'upload' or the existing URL as value
            // The actual file will be stored in fileUploads or existingImageUrls
            if (editingIndex !== null && existingImageUrls[editingIndex] && !fileUploads[editingIndex]) {
                // If editing and no new file is selected, keep the existing URL
                newBlock = { type: 'image', value: existingImageUrls[editingIndex], classes: blockClasses };
            } else if (fileUploads[editingIndex] || inputValue) { // inputValue here would be the newly selected file
                newBlock = { type: 'image', value: 'upload', classes: blockClasses }; // Placeholder for new upload
            } else {
                toast.error('Please select an image file or keep the existing image.');
                return;
            }
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
            // If a new image was selected during edit, update fileUploads
            if (contentType === 'image' && inputValue instanceof File) {
                setFileUploads(prev => ({ ...prev, [editingIndex]: inputValue }));
                setExistingImageUrls(prev => { // Clear existing URL if a new file is uploaded
                    const newUrls = { ...prev };
                    delete newUrls[editingIndex];
                    return newUrls;
                });
            }
            setEditingIndex(null);
        } else {
            setArticleStructure([...articleStructure, newBlock]);
            // If a new image is added, store the file with its future index
            if (contentType === 'image' && inputValue instanceof File) {
                setFileUploads(prev => ({ ...prev, [articleStructure.length]: inputValue }));
            }
        }
        setInputValue('');
        setBlockClasses('');
        setContentType('heading');
    };

    const handleDelete = (index) => {
        const updated = articleStructure.filter((_, i) => i !== index);
        setArticleStructure(updated);

        // If an image block was deleted, remove its corresponding file/URL entry
        if (articleStructure[index].type === 'image') {
            setFileUploads(prev => {
                const newFiles = { ...prev };
                delete newFiles[index];
                return newFiles;
            });
            setExistingImageUrls(prev => {
                const newUrls = { ...prev };
                delete newUrls[index];
                return newUrls;
            });
        }

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
            setContentType('heading');
            setListType('ul'); // Reset list type
        }
    };

    const handleEdit = (index) => {
        const item = articleStructure[index];
        setContentType(item.type);
        setBlockClasses(item.classes || '');

        if (item.type === 'points') {
            setListItems(item.value.items || []); // Access items array
            setListType(item.value.listType || 'ul'); // Set list type
            setInputValue('');
        } else if (item.type === 'image') {
            setInputValue(null); // Clear file input for new selection
            // The existing image will be displayed via existingImageUrls
        } else if (item.type === 'link') {
            setLinkText(item.value.text);
            setLinkHref(item.value.href);
        } else if (item.type === 'table') {
            setTableRows(item.value);
            setCurrentTableRow('');
        } else {
            setInputValue(item.value);
        }
        setEditingIndex(index);
    };

    const removeImageFile = (index) => {
        setFileUploads(prev => {
            const newFiles = { ...prev };
            delete newFiles[index];
            return newFiles;
        });
        setExistingImageUrls(prev => {
            const newUrls = { ...prev };
            delete newUrls[index];
            return newUrls;
        });
        // Optionally, update the block in articleStructure to remove its value or mark for replacement
        // For simplicity, we'll let handleAddContent handle the 'upload' state if a new file is chosen
        // or just keep the block type as image. The backend will handle actual file updates.
        const updatedStructure = [...articleStructure];
        if (updatedStructure[index].type === 'image') {
            updatedStructure[index].value = ''; // Clear value to indicate no image
            setArticleStructure(updatedStructure);
        }
    };


    const moveContent = (index, direction) => {
        if (editingIndex !== null) {
            toast.warn('Please finish editing the current block before reordering.');
            return;
        }
        const newArticleStructure = [...articleStructure];
        const [movedItem] = newArticleStructure.splice(index, 1);
        let newIndex = index;
        if (direction === 'up' && index > 0) {
            newIndex = index - 1;
            newArticleStructure.splice(newIndex, 0, movedItem);
        } else if (direction === 'down' && index < newArticleStructure.length - 1) {
            newIndex = index + 1;
            newArticleStructure.splice(newIndex, 0, movedItem);
        } else {
            return; // No valid move
        }

        // Update fileUploads and existingImageUrls keys to reflect new indices
        const newFileUploads = {};
        const newExistingImageUrls = {};
        newArticleStructure.forEach((block, idx) => {
            if (block.type === 'image') {
                if (fileUploads[articleStructure.indexOf(block)]) { // If it was a new upload
                    newFileUploads[idx] = fileUploads[articleStructure.indexOf(block)];
                } else if (existingImageUrls[articleStructure.indexOf(block)]) { // If it was an existing image
                    newExistingImageUrls[idx] = existingImageUrls[articleStructure.indexOf(block)];
                }
            }
        });
        setFileUploads(newFileUploads);
        setExistingImageUrls(newExistingImageUrls);
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

    const handleRemoveRelatedLink = (index) => {
        setRelatedLinks(relatedLinks.filter((_, i) => i !== index));
    };

    const handleAddClass = (cssClass) => {
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

        console.log(island);


        const formData = new FormData();
        const finalContent = [];
        const imageBlockIndexes = []; // To map the order of image files to image blocks

        // Process article structure to prepare content and identify images for upload
        articleStructure.forEach((block, index) => {
            if (block.type === 'image') {
                if (fileUploads[index]) { // This is a newly uploaded image for this block
                    formData.append('images', fileUploads[index]);
                    finalContent.push({ type: 'image', value: `image_placeholder_${imageBlockIndexes.length}`, classes: block.classes });
                    imageBlockIndexes.push(index); // Keep track of which image block this file belongs to
                } else if (existingImageUrls[index]) { // This is an existing image
                    finalContent.push({ type: 'image', value: existingImageUrls[index], classes: block.classes });
                } else {
                    // This scenario should ideally be prevented by validation or user action
                    // but as a fallback, handle missing image gracefully or error out.
                    toast.error(`Image block at index ${index} is missing its file or URL.`);
                    return;
                }
            } else {
                finalContent.push(block);
            }
        });

        // Ensure all necessary data is present before submitting
        if (finalContent.length !== articleStructure.length) {
            toast.error('There was an issue processing image blocks. Please check them.');
            return;
        }

        const authorData = {
            authorName: author,
            linkToProfile: authorLink
        };

        formData.append('title', title);
        formData.append('island', island._id);
        formData.append('tier', tier);
        formData.append('author', JSON.stringify(authorData));
        formData.append('content', JSON.stringify(finalContent));
        formData.append('relatedLinks', JSON.stringify(relatedLinks));

        try {
            let res;
            if (articleId) {
                // Update existing article
                res = await axios.put(`${API_BASE}/article/update/${articleId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: localStorage.getItem('faro-user')
                    }
                });
                toast.success('Article updated successfully!');
            } else {
                // Create new article
                res = await axios.post(`${API_BASE}/article/create/builder`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: localStorage.getItem('faro-user')
                    }
                });
                toast.success('Article submitted!');
            }

            localStorage.removeItem('faro-title');
            localStorage.removeItem('faro-island');
            localStorage.removeItem('faro-tier');
            localStorage.removeItem('faro-author');
            localStorage.removeItem('faro-authorLink');
            navigator('/admin/articles');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit article");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">{articleId ? 'Edit Article' : 'Article Builder'}</h2>
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
                                            <>
                                                {existingImageUrls[index] ? (
                                                    <div className="d-flex flex-column align-items-start">
                                                        <img src={existingImageUrls[index]} alt="Article Content" style={{ maxWidth: '540px', height: 'auto', display: 'block', marginTop: '5px' }} />
                                                        <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeImageFile(index)}>Remove Current Image</button>
                                                    </div>
                                                ) : fileUploads[index] ? (
                                                    <p>New image selected: {fileUploads[index].name}</p>
                                                ) : (
                                                    <p>Image block (no file selected yet or removed)</p>
                                                )}
                                            </>
                                        ) : item.type === 'points' ? (
                                            // Render based on listType
                                            item.value.listType === 'ul' ? (
                                                <ul>
                                                    {item.value.items.map((point, i) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ol>
                                                    {item.value.items.map((point, i) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ol>
                                            )
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
                                            <button type="button" data-bs-toggle="collapse" data-bs-target="#collapse-1" className="btn btn-sm btn-warning me-2 rounded-0" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="btn btn-sm btn-danger rounded-0" onClick={() => handleDelete(index)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className='position-fixed bg-light shadow-lg' style={{ right: '20px', bottom: '20px' }}>
                        <div className='collapse p-4 overflow-y-scroll' id='collapse-1'>
                            <div className='overflow-y-scroll' style={{ maxHeight: '80vh' }}>
                                <div className="flex-jbetween flex-acenter">
                                    <h2 className="fw-semibold fs-4 mb-0">Edit block</h2>
                                    <button
                                        type="button"
                                        class="btn"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapse-1"
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                        onClick={() => { setEditingIndex(null) }}
                                    >
                                        <i className='bi bi-x fs-2'></i>
                                    </button>
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
                                            setListType('ul'); // Reset list type when changing type
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
                                        {editingIndex !== null && existingImageUrls[editingIndex] && (
                                            <div className="mb-2">
                                                <p>Current Image:</p>
                                                <img src={existingImageUrls[editingIndex]} alt="Current" style={{ maxWidth: '200px', height: 'auto', display: 'block' }} />
                                                <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeImageFile(editingIndex)}>Remove Current Image</button>
                                            </div>
                                        )}
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
                                        <div className="mb-3"> {/* New select for list type */}
                                            <label htmlFor="listType" className="form-label">List Type</label>
                                            <select
                                                className="form-select mb-2"
                                                name='listType'
                                                id='listType'
                                                value={listType}
                                                onChange={(e) => setListType(e.target.value)}
                                            >
                                                <option value="ul">Unordered List (Bullets)</option>
                                                <option value="ol">Ordered List (Numbers)</option>
                                            </select>
                                        </div>
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
                                            // Render based on listType
                                            listType === 'ul' ? (
                                                <ul className="list-group mb-2">
                                                    {listItems.map((item, idx) => (
                                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                            {item}
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setListItems(listItems.filter((_, i) => i !== idx))}>x</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ol className="list-group mb-2">
                                                    {listItems.map((item, idx) => (
                                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                            {item}
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setListItems(listItems.filter((_, i) => i !== idx))}>x</button>
                                                        </li>
                                                    ))}
                                                </ol>
                                            )
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
                                                        {
                                                            Array.from({ length: Math.max(...tableRows.map(row => row.length), 0) }).map((_, i) => (
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
                                                            {
                                                                row.length < Math.max(...tableRows.map(r => r.length), 0) &&
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

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-dark rounded-0 px-3"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapse-1"
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                        onClick={() => { setEditingIndex(null) }}
                                    >
                                        close
                                    </button>
                                    <button className="btn btn-primary rounded-0 px-4" onClick={handleAddContent} disabled={
                                        (contentType === 'link' && (!linkText.trim() || !linkHref.trim())) ||
                                        (contentType === 'points' && listItems.length === 0 && !inputValue.trim()) ||
                                        (contentType === 'table' && tableRows.length === 0 && !currentTableRow.trim()) ||
                                        ((contentType !== 'points' && contentType !== 'link' && contentType !== 'table' && contentType !== 'image') && !inputValue.trim()) ||
                                        (contentType === 'image' && editingIndex === null && !inputValue) // For new image, require inputValue (file)
                                    }>
                                        {editingIndex !== null ? 'Update Block' : 'Add to Article'}
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                <button className="btn btn-sm btn-outline-danger rounded-0" onClick={() => handleRemoveRelatedLink(idx)}>x</button>
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
                                    {item.type === 'points' && item.value.listType && <span className="ms-2 badge bg-info">List Type: {item.value.listType}</span>} {/* Display list type in progress */}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="position-fixed top-0 end-0 ps-5 pb-5 mt-3">
                        <button className="btn btn-primary rounded-0 px-4" onClick={() => setShowPreviewModal(true)}>Show Full Article Preview</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="d-flex justify-content-center gap-3 p-3">
                <button className="btn btn-danger px-4 rounded-0" onClick={() => navigator('/account')}>Cancel</button>
                <button className="btn btn-success px-4 rounded-0" onClick={handleSubmitArticle}>{articleId ? 'Update Article' : 'Publish Article'}</button>
            </div>

            <ArticlePreviewModal
                show={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                articleStructure={articleStructure}
                fileUploads={fileUploads}
                relatedLinks={relatedLinks}
                existingImageUrls={existingImageUrls} // Pass existing image URLs to preview
            />
        </div>
    );
};

export default ArticleBuilder;