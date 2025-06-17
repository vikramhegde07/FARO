import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../../API';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { formatDateOrToday } from '../../utils/dateFormatter';
import EditSample from './EditSample';

function EditDetails({ island, refresh }) {
    const [title, setTitle] = useState('');
    const [types, setTypes] = useState([]);
    const [newValue, setNewValue] = useState('');

    function handleUpdate(e) {
        e.preventDefault();

        let changed = false;
        if (title !== island.title || types !== island.articleTypes)
            changed = true;

        if (!changed)
            return toast.info("No changes detected!");
        const formData = {};
        formData.islandId = island._id;
        formData.title = title;
        formData.articleTypes = JSON.stringify(types);

        axios
            .patch(`${API_BASE}/island/edit`, formData)
            .then((response) => {
                console.log(response);
                if (response.status === 200)
                    refresh();
            })
            .catch((error) => {
                console.log(error.response);
            });

    }

    useEffect(() => {
        setTitle(island.title);
        setTypes(island.articleTypes);
    }, [island])

    return (
        <>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Island Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        onChange={(e) => { setTitle(e.target.value) }}
                        className="form-control rounded-0"
                        value={title}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="articleTypes" className="form-label">Article Types</label>
                    <input
                        type="text"
                        className="form-control  rounded-0"
                        value={newValue}
                        onChange={(e) => { setNewValue(e.target.value) }}
                    />
                    <div className="flex-jend mt-2">
                        <button
                            type='button'
                            className={`btn btn-success px-3 rounded-0 ${newValue === '' ? 'disabled' : ''}`}
                            onClick={() => {
                                setTypes([...types, newValue]);
                                setNewValue('');
                            }}
                        >Add New Type</button>
                    </div>
                    <div className="mt-2">
                        {types.length !== 0 && (
                            <div className='flex-acenter gap-2 flex-wrap'>
                                {types.map((type, index) => (
                                    <button
                                        type='button'
                                        key={index}
                                        className="btn btn-sm btn-outline-primary px-2 rounded-0 flex-acenter gap-2"
                                        onClick={() => {
                                            if (index !== 0) {
                                                const updated = types.filter((_, i) => i !== index);
                                                setTypes(updated);
                                            }
                                        }}
                                    >
                                        {type}
                                        {index !== 0 && (
                                            <ion-icon name="close-outline"></ion-icon>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <hr />
                <div className="mb-3 flex-jend">
                    <button type="submit" className="btn btn-danger px-4 rounded-0">Update Island</button>
                </div>
            </form>
        </>
    )
}

function IslandData() {
    const { id } = useParams();
    const [island, setIsland] = useState({});
    const [samples, setSamples] = useState([]);
    const [articles, setArticles] = useState([]);
    const [editDetailsMode, setEditDetailsMode] = useState(false);

    const [editingSample, setEditingSample] = useState(null);
    const [editSampleMode, setEditSampleMode] = useState(false);

    const closeSampleEditing = () => {
        setEditSampleMode(false);
        setEditingSample(null);
    }

    const [articlePerPage, setArticlePerPage] = useState(9);
    const [page, setPage] = useState(1);
    const [pagedArticles, setPagedArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    function getIslandData() {
        setIsland({});
        if (editDetailsMode) setEditDetailsMode(false);
        axios
            .get(`${API_BASE}/island/${id}`)
            .then((response) => {
                console.log(response.data);
                setIsland(response.data.islandData);
                if (response.data.articles) {
                    setArticles(response.data.articles);
                    setSamples(response.data.islandData.samples);
                    const lastArticleIndex = articlePerPage * page;
                    const firstArticleIndex = lastArticleIndex - articlePerPage;
                    setTotalPages(Math.ceil(response.data.articles.length / articlePerPage));
                    setPagedArticles(response.data.articles.slice(firstArticleIndex, lastArticleIndex));
                }
                else {
                    setArticles([]);
                    setPagedArticles([]);
                }
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    useEffect(() => {
        const lastArticleIndex = articlePerPage * page;
        const firstArticleIndex = lastArticleIndex - articlePerPage;
        setPagedArticles(articles.slice(firstArticleIndex, lastArticleIndex));
    }, [page])

    useEffect(() => {
        getIslandData();
    }, [])

    return (
        <div className='container-fluid'>
            <h2 className="text-center fs-4 fw-semibold">Manage Island Data</h2>
            <hr />

            <div className="row">
                {!editDetailsMode && (
                    <div className="col-md-6 p-3">
                        <div className="container-fluid rounded-2 border border-dark-subtle p-3">
                            <div className="flex-jbetween flex-acenter">
                                <h2 className="fw-semibold fs-4 text-indigo">Island Details</h2>
                                <i
                                    className="bi bi-pencil-square cursor-pointer fs-5"
                                    onClick={() => { setEditDetailsMode(!editDetailsMode) }}
                                ></i>
                            </div>
                            <hr />
                            <div className="d-flex gap-2">
                                <h3 className="fw-semibold fs-5">Island Name:</h3>
                                <h3 className="fs-5">{island.title}</h3>
                            </div>
                            <h3 className="fw-semibold fs-5 mt-2">Article Types:</h3>
                            <div className="flex-acenter gap-3 mt-3 flex-wrap">
                                {island.articleTypes?.map((type, index) => (
                                    <button
                                        className="btn btn-primary px-3 rounded-0 flex-acenter gap-2"
                                        key={index}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {editDetailsMode && (
                    <div className='col-md-6 p-3'>
                        <div className="container-fluid rounded-2 border border-dark-subtle p-3">
                            <div className="flex-jbetween flex-acenter">
                                <h3 className="text-indigo fw-semibold fs-4">Edit Details</h3>
                                <ion-icon
                                    className="fs-4 fw-semibold cursor-pointer"
                                    name="close-outline"
                                    onClick={() => { setEditDetailsMode(false) }}
                                ></ion-icon>
                            </div>
                            <hr />
                            <EditDetails island={island} refresh={getIslandData} />
                        </div>
                    </div>
                )}

                <div className="col-md-6 p-3">
                    <div className="container-fluid rounded-2 border border-dark-subtle p-3">
                        <div className="flex-jbetween flex-acenter">
                            <h3 className="text-indigo fw-semibold fs-4">Samples</h3>
                            <div className="dropdown">
                                <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-pencil-square cursor-pointer fs-5"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            type='button'
                                            className="dropdown-item"
                                            onClick={() => { setEditSampleMode(true) }}
                                        >Add New Sample</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr />
                        {samples.length === 0 ? (
                            <>
                                <h3 className="text-center fst-italic fw-semibold fs-5">Sorry! No Samples available.</h3>
                                <div className="flex-jcenter mt-3">
                                    <button
                                        type='button'
                                        onClick={() => { setEditSampleMode(true) }}
                                        className="btn btn-dark rounded-0 px-3"
                                    >
                                        Add New Sample
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {samples.map(sample => (
                                    <>
                                        <div className='flex-jbetween' key={sample._id}>
                                            <h4 className="fs-5" >{sample.name}</h4>
                                            <button
                                                type="button"
                                                className="btn btn-danger rounded-0 px-3"
                                                onClick={() => {
                                                    setEditingSample(sample);
                                                    setEditSampleMode(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <hr />
                                    </>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <h2 className="text-center fw-semibold fs-4 mt-5">Manage Island Articles</h2>
            <hr />
            <div className="row gap-3 mt-2">
                {pagedArticles.length === 0 ?
                    <h2 className="text-center fw-semibold text-indigo fs-5 fst-italic">Sorry No Articles Found!</h2>
                    :
                    <>
                        {pagedArticles.map((article) => (
                            <div className="col-md-4 shadow p-3 rounded-2" key={article._id} style={{ maxWidth: '24rem' }}>
                                <div className="flex-jbetween">
                                    <h3 className="fs-5 text-indigo fw-semibold">{article.title}</h3>
                                    <i
                                        className="bi bi-pencil-square cursor-pointer fs-5"
                                        onClick={() => { }}
                                    ></i>
                                </div>
                                <p className="fs-6 text-muted fst-italic">Published On: {formatDateOrToday(article.createdAt)}</p>
                                <p className="fs-6">Published By: {article.author.authorName}</p>
                            </div>
                        ))}
                        <div className="container mt-4">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    {page !== 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                aria-label="Previous"
                                                onClick={() => {
                                                    setPage(page - 1);
                                                }}
                                            >
                                                <span aria-hidden="true">&laquo;</span>
                                            </button>
                                        </li>
                                    )}
                                    {page - 1 > 0 && (
                                        <li className="page-item">
                                            <button
                                                type='button'
                                                className="page-link"
                                                onClick={() => {
                                                    setPage(page - 1);
                                                }}
                                            >{page - 1}</button>
                                        </li>
                                    )}
                                    <li className="page-item active">
                                        <button className="page-link">{page}</button>
                                    </li>
                                    {page + 1 <= totalPages && (
                                        <li className="page-item">
                                            <button
                                                type='button'
                                                className="page-link"
                                                onClick={() => {
                                                    setPage(page + 1);
                                                }}
                                            >{page + 1}</button>
                                        </li>
                                    )}
                                    {totalPages !== page && (
                                        <li className="page-item">
                                            <button
                                                type='button'
                                                className="page-link"
                                                aria-label="Next"
                                                onClick={() => {
                                                    setPage(page + 1);
                                                }}
                                            >
                                                <span aria-hidden="true">&raquo;</span>
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </>
                }
            </div>


            {editSampleMode && <EditSample island={island} sample={editingSample} close={closeSampleEditing} refresh={getIslandData} />}
        </div>
    )
}

export default IslandData;
