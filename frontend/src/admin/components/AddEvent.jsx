import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE from '../../API';

const AddEvent = () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [contentType, setContentType] = useState('heading');
    const [inputValue, setInputValue] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkHref, setLinkHref] = useState('');
    const [listItems, setListItems] = useState([]);
    const [contentBlocks, setContentBlocks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [fileUploads, setFileUploads] = useState([]);

    const navigator = useNavigate();

    const handleAddBlock = () => {
        if (contentType === 'points') {
            if (listItems.length > 0) {
                setContentBlocks([...contentBlocks, { type: 'points', value: listItems }]);
                setListItems([]);
            }
        } else if (contentType === 'link') {
            if (linkText && linkHref) {
                setContentBlocks([...contentBlocks, { type: 'link', value: { text: linkText, href: linkHref } }]);
                setLinkText('');
                setLinkHref('');
            }
        } else if (contentType === 'image') {
            if (inputValue) {
                setContentBlocks([...contentBlocks, { type: 'image', value: 'upload' }]);
                setFileUploads([...fileUploads, inputValue]);
            }
        } else {
            if (inputValue.trim()) {
                setContentBlocks([...contentBlocks, { type: contentType, value: inputValue }]);
                setInputValue('');
            }
        }
        setEditingIndex(null);
    };

    const handleEdit = (index) => {
        const item = contentBlocks[index];
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

    const handleDelete = (index) => {
        const updated = contentBlocks.filter((_, i) => i !== index);
        setContentBlocks(updated);
    };

    const handleAddListItem = () => {
        if (inputValue.trim()) {
            setListItems([...listItems, inputValue]);
            setInputValue('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !location || !eventDate || contentBlocks.length === 0) {
            toast.error('Please fill all fields and add content');
            return;
        }

        const formData = new FormData();
        const updatedContent = [];
        let fileIndex = 0;

        for (const block of contentBlocks) {
            if (block.type === 'image' && block.value === 'upload') {
                formData.append('images', fileUploads[fileIndex]);
                updatedContent.push({ type: 'image', value: 'upload' });
                fileIndex++;
            } else {
                updatedContent.push(block);
            }
        }

        formData.append('title', title);
        formData.append('location', location);
        formData.append('eventDate', eventDate);
        formData.append('content', JSON.stringify(updatedContent));

        try {
            await axios.post(`${API_BASE}/event/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('faro-user'), // optional if needed
                },
            });

            toast.success('Event created successfully!');
            navigator('/admin/events');
        } catch (error) {
            toast.error('Failed to create event.');
        }
    };

    return (
        <div className="admin-content mt-4 px-2">
            <h2 className="mb-4 text-center">Event Builder</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Event Date</label>
                        <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                    </div>

                    <hr />

                    <h5>Content Blocks</h5>
                    <div className="mb-3">
                        {contentBlocks.map((item, index) => (
                            <div key={index} className="border p-2 mb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <strong>{item.type.toUpperCase()}:</strong>
                                        {item.type === 'image' ? (
                                            <img src={item.value} alt="preview" style={{ maxWidth: '100%' }} />
                                        ) : item.type === 'points' ? (
                                            <ul>{item.value.map((pt, i) => <li key={i}>{pt}</li>)}</ul>
                                        ) : item.type === 'link' ? (
                                            <p><a href={item.value.href} target="_blank" rel="noreferrer">{item.value.text}</a></p>
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

                    <label className="form-label">Content Type</label>
                    <select className="form-select mb-2" value={contentType} onChange={(e) => setContentType(e.target.value)}>
                        <option value="heading">Heading</option>
                        <option value="subheading">Subheading</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="points">Points</option>
                        <option value="image">Image</option>
                        <option value="link">Link</option>
                    </select>

                    {contentType === 'link' && (
                        <>
                            <input type="text" className="form-control mb-2" placeholder="Link Text" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
                            <input type="text" className="form-control mb-2" placeholder="Link URL" value={linkHref} onChange={(e) => setLinkHref(e.target.value)} />
                        </>
                    )}

                    {contentType === 'image' ? (
                        <input type="file" className="form-control mb-2" onChange={(e) => setInputValue(e.target.files[0])} />
                    ) : (
                        <input type="text" className="form-control mb-2" placeholder={`Enter ${contentType}`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    )}

                    {contentType === 'points' && (
                        <>
                            <button className="btn btn-secondary mb-2" onClick={handleAddListItem} disabled={!inputValue}>Add List Item</button>
                            <ul>{listItems.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                        </>
                    )}

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={handleAddBlock}>Add Content Block</button>
                    </div>
                </div>

                <div className="col-md-6">
                    <h5>Live Preview</h5>
                    <div className="border p-3 bg-light">
                        {contentBlocks.map((block, index) => {
                            switch (block.type) {
                                case 'heading': return <h3 key={index}>{block.value}</h3>;
                                case 'subheading': return <h5 key={index}>{block.value}</h5>;
                                case 'paragraph': return <p key={index}>{block.value}</p>;
                                case 'points': return <ul key={index}>{block.value.map((pt, i) => <li key={i}>{pt}</li>)}</ul>;
                                case 'image': return <img key={index} src={block.value} alt="preview" className="img-fluid" />;
                                case 'link': return <a key={index} href={block.value.href} target="_blank" rel="noreferrer">{block.value.text}</a>;
                                default: return null;
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-success px-4" onClick={handleSubmit}>Submit Event</button>
            </div>
        </div>
    );
};

export default AddEvent;
