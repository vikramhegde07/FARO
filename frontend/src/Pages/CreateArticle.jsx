import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../API';
import { toast } from 'react-toastify';

const CreateArticle = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [authorLink, setAuthorLink] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('');
    const [method, setMethod] = useState('');
    const [allIslands, setAllIslands] = useState([]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!method) return toast.error('Please select a method');
        if (!tier) return toast.error('Please select a tier for the content');

        localStorage.setItem('faro-title', title);
        localStorage.setItem('faro-island', island);
        localStorage.setItem('faro-tier', tier);
        localStorage.setItem('faro-author', author);
        localStorage.setItem('faro-authorLink', authorLink);

        if (method === 'builder') {
            navigate('/createArticle/builder');
        } else {
            navigate('/createArticle/parseDocx');
        }
    };

    function getAllIslands() {
        axios
            .get(`${API_BASE}/island`)
            .then((response) => {
                setAllIslands(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    useEffect(() => {
        getAllIslands();
    }, [])

    return (
        <>
            <div className="container m-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-lg p-4">
                            <h3 className="mb-4">Create New Article</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Article Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Author Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Author Profile Link</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={authorLink}
                                            placeholder='(if any)'
                                            onChange={(e) => setAuthorLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Island to Publish</label>
                                    <select
                                        name="island"
                                        id="island"
                                        className="form-select"
                                        onChange={(e) => { setIsland(e.target.value) }}
                                        required
                                    >
                                        <option value={null}>Select Island</option>
                                        {
                                            !allIslands ? '' : allIslands.map((island) => (
                                                <option value={island._id} key={island._id} >{island.title}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Content Tier</label>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className={`card p-3 ${tier === 'free' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setTier('free')}>
                                                <h5>Free</h5>
                                                <p className="small">Any user can access the contents.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className={`card p-3 ${tier === 'paid' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setTier('paid')}>
                                                <h5>Premium</h5>
                                                <p className="small">Only Island suscribers can access the contents.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Method</label>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className={`card p-3 ${method === 'builder' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setMethod('builder')}>
                                                <h5>Create using Builder</h5>
                                                <p className="small">Manually create your article section by section.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className={`card p-3 ${method === 'docx' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setMethod('docx')}>
                                                <h5>Parse DOCX File</h5>
                                                <p className="small">Upload a .docx file and auto-generate the article.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex-jcenter'>
                                    <button type="submit" className={`btn btn-primary`}>Continue</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default CreateArticle;
