import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../API';
import { toast } from 'react-toastify';


function Island({ logged }) {
    const [articles, setArticles] = useState([]);
    const navigator = useNavigate();
    const { id } = useParams();
    const [subscription, setSubscription] = useState(false);

    function getAllArticles() {
        axios
            .get(`${API_BASE}/article/island/${id}`)
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    function checkAccess() {
        axios
            .get(`${API_BASE}/island/checkAccess/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status == 200) {
                    setSubscription(true);
                }
            })
            .catch((error) => {
                setSubscription(false);
            })
    }

    useEffect(() => {
        getAllArticles();
        checkAccess();
    }, [])
    return (
        <>

            <div className="container-fluid px-5 flex-jbetween my-2">
                <Link className="btn btn-primary flex-center gap-2" to={'/'}>
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    <ion-icon name="home-outline"></ion-icon>
                </Link>
                <div className="d-flex flex-md-row flex-sm-column gap-2" style={{ width: "fit-content" }}>
                    <input
                        type="text"
                        className="form-control"
                        name='search'
                        onChange={() => { }}
                        placeholder='Search Article'
                    />
                    <button className="btn btn-primary">Search</button>
                </div>
            </div>
            <h1 className="text-center mt-3">Articles of Island</h1>
            <hr />

            <div className='container-fluid p-4'>
                <div className="row flex-center gap-2">

                    <div className="col-md-5">
                        <h2 className="text-center fw-semibold fs-3">Free Tier Articles</h2>
                        {articles.length == 0 ? '' : (
                            <div className="list-group">
                                {articles.map((article) => (
                                    article.tier == 'free' && (
                                        <Link to={`/article/${article._id}`} key={article._id} className='list-group-item flex-jbetween text-primary'>
                                            {article.title}
                                            <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-md-5">
                        <h2 className="text-center fw-semibold fs-3">Subscriber Exclusive</h2>
                        {articles.length == 0 ? '' : (
                            <div className="list-group">
                                {articles.map((article) => (
                                    article.tier != 'free' && (
                                        <Link to={`/article/${article._id}`} key={article._id} className={`list-group-item flex-jbetween text-primary ${subscription ? '' : 'disabled'}`}>
                                            {article.title}
                                            {subscription ?
                                                <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                                :
                                                <ion-icon name="lock-closed-outline" className="fs-5"></ion-icon>
                                            }
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Island
