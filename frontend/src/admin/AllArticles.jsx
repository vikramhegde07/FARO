import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../API';
import ArticleList from './components/ArticleList';

function AllArticles() {
    const [allArticles, setAllArticles] = useState([]);
    const [approved, setApproved] = useState([]);
    const [approvalPending, setApprovalPending] = useState([]);
    const [reviewPending, setReviewPending] = useState([]);

    const [list, setList] = useState('all');

    function getArticles() {
        setAllArticles([]);
        setApproved([]);
        setApprovalPending([]);
        setReviewPending([]);
        axios
            .get(`${API_BASE}/article/articles-categorized`)
            .then((response) => {
                setApproved(response.data.approvedArticles);
                setApprovalPending(response.data.approvalPendingArticles);
                setReviewPending(response.data.reviewPendingArticles);
                setAllArticles(approved);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getArticles();
    }, [])

    return (
        <>
            <h2 className="text-center fw-semibold">Manage Articles</h2>
            <hr />
            <div className="row">
                <div className="col-md-3">
                    <h1 className="text-center fs-4">Article  Stats</h1>
                    <ul className="list-group" id="list-tab" role="tablist">
                        <button
                            type='button'
                            className="list-group-item flex-jbetween list-group-item-action active"
                            aria-current="true"
                            data-bs-toggle="list"
                            onClick={() => { setList('all') }}
                        >
                            <h5 className='text-decoration-none  fs-6'>All Articles</h5>
                            <span className="badge text-bg-primary">{allArticles.length}</span>
                        </button>
                        <button
                            type='button'
                            className="list-group-item flex-jbetween list-group-item-action"
                            data-bs-toggle="list"
                            onClick={() => { setList('approved') }}
                        >
                            <h5 className='text-decoration-none  fs-6'>Approved Articles</h5>
                            <span className="badge text-bg-primary">{approved.length}</span>
                        </button>
                        <button
                            type='button'
                            className="list-group-item flex-jbetween list-group-item-action"
                            data-bs-toggle="list"
                            onClick={() => { setList('pending') }}
                        >
                            <h5 className='text-decoration-none  fs-6'>Approval Pending</h5>
                            <span className="badge text-bg-warning">{approvalPending.length}</span>
                        </button>
                        <button
                            type='button'
                            className="list-group-item flex-jbetween list-group-item-action"
                            data-bs-toggle="list"
                            onClick={() => { setList('review') }}
                        >
                            <h5 className='text-decoration-none  fs-6'>Review Pending</h5>
                            <span className="badge text-bg-danger">{reviewPending.length}</span>
                        </button>
                    </ul>
                </div>
            </div>
            <hr />
            {list === 'all' && <ArticleList refresh={getArticles} articles={allArticles} list={list} />}
            {list === 'approved' && <ArticleList refresh={getArticles} articles={approved} list={list} />}
            {list === 'pending' && <ArticleList refresh={getArticles} articles={approvalPending} list={list} />}
            {list === 'review' && <ArticleList refresh={getArticles} articles={reviewPending} list={list} />}
        </>
    )
}

export default AllArticles
