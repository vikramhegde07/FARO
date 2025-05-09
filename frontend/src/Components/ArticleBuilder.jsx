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
    const [editingIndex, setEditingIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('paid');

    const navigator = useNavigate();

    const uploadImageToServer = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${API_BASE}/article/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data.url;
        } catch (err) {
            console.error('Image upload failed:', err);
            return null;
        }
    };

    const handleAddContent = async () => {
        if (contentType === 'points') {
            setArticleStructure([...articleStructure, { type: contentType, value: listItems }]);
            setListItems([]);
        } else if (contentType === 'image') {
            const uploadedUrl = await uploadImageToServer(inputValue);
            if (uploadedUrl) {
                setArticleStructure([...articleStructure, { type: 'image', value: uploadedUrl }]);
            } else {
                alert('Failed to upload image');
            }
            reader.readAsDataURL(inputValue);
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

    const handleSubmitArticle = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('island', island);
        formData.append('tier', tier);
        formData.append('content', JSON.stringify(articleStructure));


        axios
            .post(`${API_BASE}/article/create/builder`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                localStorage.removeItem('faro-title');
                localStorage.removeItem('faro-island');
                localStorage.removeItem('faro-tier');
                toast.success("Article Submitted successfully!");
                navigator('/account');
            })
            .catch((error) => {
                toast.error("Error while submitting article! : " + error.response.data);
            })
    };

    useEffect(() => {
        setTitle(localStorage.getItem('faro-title'));
        setIsland(localStorage.getItem('faro-island'));
        setTier(localStorage.getItem('faro-tier'));
    }, [])

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <h1 className='text-center'>Article Builder</h1>
                    <hr />
                    <div className="col-md-6 border-end border-black-50">
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
                    </div>

                    <div className="col-md-6">
                        <h4>Live Preview</h4>
                        <div className="p-3 border bg-light">
                            {articleStructure.map((item, index) => {
                                switch (item.type) {
                                    case 'heading':
                                        return <h2 key={index}>{item.value}</h2>;
                                    case 'subheading':
                                        return <h4 key={index}>{item.value}</h4>;
                                    case 'paragraph':
                                        return <p key={index}>{item.value}</p>;
                                    case 'link':
                                        return <a key={index} href={item.value.href} target="_blank" rel="noopener noreferrer">{item.value.text}</a>;
                                    case 'points':
                                        return <ul key={index}>{item.value.map((point, i) => <li key={i}>{point}</li>)}</ul>;
                                    case 'image':
                                        return <img key={index} src={item.value} alt="preview" style={{ maxWidth: '100%' }} />;
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                    <hr className='mt-4' />
                    <div className="col-md-12 flex-center pb-4 gap-2">
                        <button
                            className="btn btn-danger mt-3"
                            onClick={() => { }}
                        >Cancel
                        </button>
                        <button
                            className="btn btn-success mt-3"
                            onClick={handleSubmitArticle}
                            disabled={!title || !island || articleStructure.length === 0}
                        >
                            Publish Article
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArticleBuilder;