import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ArticleBuilder = () => {
    const [contentType, setContentType] = useState('heading');
    const [inputValue, setInputValue] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkHref, setLinkHref] = useState('');
    const [listItems, setListItems] = useState([]);
    const [articleStructure, setArticleStructure] = useState([]);
    const [relatedLinks, setRelatedLinks] = useState([]);
    const [relatedFiles, setRelatedFiles] = useState([]);
    const [fileUploads, setFileUploads] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('paid');

    const navigator = useNavigate();

    const handleAddContent = () => {
        if (contentType === 'points') {
            setArticleStructure([...articleStructure, { type: contentType, value: listItems }]);
            setListItems([]);
        } else if (contentType === 'image') {
            if (inputValue) {
                setArticleStructure([...articleStructure, { type: 'image', value: 'upload' }]);
                setFileUploads([...fileUploads, inputValue]);
            } else {
                alert('Please select an image');
            }
        } else if (contentType === 'link') {
            setArticleStructure([...articleStructure, { type: contentType, value: { text: linkText, href: linkHref } }]);
            setLinkText('');
            setLinkHref('');
        } else {
            setArticleStructure([...articleStructure, { type: contentType, value: inputValue }]);
            setInputValue('');
        }
        setEditingIndex(null);
    };

    const handleDelete = (index) => {
        const updated = articleStructure.filter((_, i) => i !== index);
        setArticleStructure(updated);
    };

    const handleEdit = (index) => {
        const item = articleStructure[index];
        setContentType(item.type);
        if (item.type === 'points') {
            setListItems(item.value);
        } else if (item.type === 'image') {
            setInputValue(null);
        } else if (item.type === 'link') {
            setLinkText(item.value.text);
            setLinkHref(item.value.href);
        } else {
            setInputValue(item.value);
        }
        setEditingIndex(index);
        handleDelete(index);
    };

    const addListItem = () => {
        setListItems([...listItems, inputValue]);
        setInputValue('');
    };

    const addRelatedLink = () => {
        if (linkText && linkHref) {
            setRelatedLinks([...relatedLinks, { linkText, linkAddr: linkHref }]);
            setLinkText('');
            setLinkHref('');
        }
    };

    const addRelatedFile = (file) => {
        if (file) {
            setRelatedFiles([...relatedFiles, { fileName: file.name, linkToFile: 'upload' }]);
            setFileUploads([...fileUploads, file]);
        }
    };

    const handleSubmitArticle = async () => {
        const formData = new FormData();
        const updatedContent = [];
        let fileIndex = 0;

        for (const block of articleStructure) {
            if (block.type === 'image' && block.value === 'upload') {
                formData.append('images', fileUploads[fileIndex]);
                updatedContent.push({ type: 'image', value: 'upload' });
                fileIndex++;
            } else {
                updatedContent.push(block);
            }
        }

        for (const file of fileUploads.slice(fileIndex)) {
            formData.append('files', file);
        }

        formData.append('title', title);
        formData.append('island', island);
        formData.append('tier', tier);
        formData.append('content', JSON.stringify(updatedContent));
        formData.append('relatedLinks', JSON.stringify(relatedLinks));
        formData.append('relatedFiles', JSON.stringify(relatedFiles));

        axios.post(`${API_BASE}/article/create/builder`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('faro-user')
            }
        })
            .then((res) => {
                toast.success('Article submitted!');
                localStorage.removeItem('faro-title');
                localStorage.removeItem('faro-island');
                localStorage.removeItem('faro-tier');
                navigator('/account');
            })
            .catch(err => toast.error("Failed to submit article"));
    };

    useEffect(() => {
        setTitle(localStorage.getItem('faro-title'));
        setIsland(localStorage.getItem('faro-island'));
        setTier(localStorage.getItem('faro-tier'));
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center">Article Builder</h2>
            <div className="row mt-4">
                <div className="col-md-6">
                    <h4>Content Blocks</h4>
                    <div className="mb-3">
                        {articleStructure.map((item, index) => (
                            <div key={index} className="border p-2 mb-2">
                                <div className="flex-jbetween flex-acenter">
                                    <div>
                                        <strong>{item.type.toUpperCase()}:</strong>
                                        {item.type === 'image' ? (
                                            <img src={item.value} alt="preview" style={{ maxWidth: '100%' }} />
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
                                        ) : (
                                            <p>{item.value}</p>
                                        )}
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(index)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
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
                            onChange={(e) => setContentType(e.target.value)}
                        >
                            <option value="heading">Heading</option>
                            <option value="subheading">Subheading</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="points">Points (List)</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
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
                                <label htmlFor="linkURL" className='form-label'>Address(URL) for the link</label>
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
                    ) : (
                        <input
                            type="text"
                            name='textInput'
                            id='textInput'
                            className="form-control mb-2"
                            placeholder={`Enter ${contentType}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    )}

                    {contentType === 'points' && (
                        <>
                            <button className="btn btn-secondary mb-2" onClick={addListItem} disabled={!inputValue}>Add List Item</button>
                            <ul>
                                {listItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    <div className="flex-jend">
                        <button className="btn btn-primary" onClick={handleAddContent} disabled={
                            (contentType === 'link' && (!linkText || !linkHref)) ||
                            (!inputValue && contentType !== 'points' && contentType !== 'link')
                        }>
                            {editingIndex !== null ? 'Update' : 'Add to Article'}
                        </button>
                    </div>

                    <hr />

                    <h5>Related Links</h5>
                    <div className="mb-3">
                        <input type="text" className="form-control mb-2" placeholder="Link Text" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
                        <input type="text" className="form-control mb-2" placeholder="Link URL" value={linkHref} onChange={(e) => setLinkHref(e.target.value)} />
                        <button className="btn btn-secondary" onClick={addRelatedLink}>Add Related Link</button>
                    </div>
                    <ul>
                        {relatedLinks.map((link, idx) => (
                            <li key={idx}><a href={link.linkAddr} target="_blank" rel="noreferrer">{link.linkText}</a></li>
                        ))}
                    </ul>

                    <hr />

                    <h5>Related Files</h5>
                    <input type="file" className="form-control mb-2" onChange={(e) => addRelatedFile(e.target.files[0])} />
                    <ul>
                        {relatedFiles.map((file, idx) => (
                            <li key={idx}>{file.fileName}</li>
                        ))}
                    </ul>
                </div>

                <div className="col-md-6">
                    <h4>Preview</h4>
                    <div className="border p-3">
                        {articleStructure.map((item, index) => {
                            switch (item.type) {
                                case 'heading': return <h2 key={index}>{item.value}</h2>;
                                case 'subheading': return <h4 key={index}>{item.value}</h4>;
                                case 'paragraph': return <p key={index}>{item.value}</p>;
                                case 'points': return <ul key={index}>{item.value.map((pt, i) => <li key={i}>{pt}</li>)}</ul>;
                                case 'link': return <a key={index} href={item.value.href}>{item.value.text}</a>;
                                case 'image': return <img key={index} src={item.value} alt="img" className="img-fluid" />;
                                default: return null;
                            }
                        })}
                    </div>
                </div>
            </div>

            <hr />

            <div className="flex-center gap-3 p-3">
                <button className="btn btn-danger px-4 rounded-0" onClick={() => navigator('/account')}>Cancel</button>
                <button className="btn btn-success px-4 rounded-0" onClick={handleSubmitArticle}>Publish Article</button>
            </div>
        </div>
    );
};

export default ArticleBuilder;
