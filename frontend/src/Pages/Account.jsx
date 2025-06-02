import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import API_BASE from '../API';
import { useState } from 'react';
import { useEffect } from 'react';

function Account({ refresh }) {
    const [userInfo, setUserInfo] = useState();
    const navigator = useNavigate();

    function handleLogout() {
        localStorage.removeItem('faro-user');
        localStorage.removeItem('faro-user-info');
        refresh();
        navigator('/');
    }

    useEffect(() => {
        setUserInfo(JSON.parse(localStorage.getItem('faro-user-info')));
    }, [])

    return (
        <>
            <div className="container bg-white py-5 w-75">
                <h2 className="mb-3 text-center">Welcome Back, {userInfo?.username}</h2>
                <p className="text-muted text-center mb-4">Manage your FARO account</p>

                <div className="row flex-center gap-3">
                    <div className="col-md-4">
                        <Link to={'/account/profile'} className="card text-decoration-none hover-shadow-1">
                            <div className="card-body">
                                <h5 className="fs-3 flex-center gap-3">
                                    <i className="bi bi-person-circle"></i>
                                    Profile
                                </h5>
                                <p className="card-text text-muted text-center">Manage Your Profile Data</p>
                            </div>
                        </Link>
                    </div>
                    {userInfo?.privillage.includes('write') ? (
                        <div className="col-md-4">
                            <Link to={'/createArticle'} className="card text-decoration-none hover-shadow-1">
                                <div className="card-body">
                                    <h5 className="fs-3 flex-center gap-3">
                                        <i className="bi bi-file-earmark-plus-fill"></i>
                                        Create Article
                                    </h5>
                                    <p className="card-text text-muted text-center">Create New Article</p>
                                </div>
                            </Link>
                        </div>
                    ) : ''
                    }
                    {userInfo?.privillage.includes('review') ? (
                        <div className="col-md-4">
                            <Link to={'/review'} className="card text-decoration-none hover-shadow-1">
                                <div className="card-body">
                                    <h5 className="fs-3 flex-center gap-3">
                                        <i className="bi bi-file-earmark-check"></i>                                        Review Article
                                    </h5>
                                    <p className="card-text text-muted text-center">Review New Articles</p>
                                </div>
                            </Link>
                        </div>
                    ) : ''
                    }

                    <div className="col-md-4">
                        <Link to={'/account/subscriptions'} className="card text-decoration-none hover-shadow-1">
                            <div className="card-body">
                                <h5 className="fs-3 flex-center gap-3">
                                    <i className="bi bi-cash"></i>
                                    Subscriptions
                                </h5>
                                <p className="card-text text-muted text-center">Manage Your Purchases</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to={'/account/privillage'} className="card text-decoration-none hover-shadow-1">
                            <div className="card-body">
                                <h5 className="fs-3 flex-center gap-3">
                                    <ion-icon name="ribbon-outline"></ion-icon>
                                    Privillages
                                </h5>
                                <p className="card-text text-muted text-center">Get Access to become Author,Curator,Editor</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to={'/account/preference'} className="card text-decoration-none hover-shadow-1">
                            <div className="card-body">
                                <h5 className="fs-3 flex-center gap-3">
                                    <i className="bi bi-gear"></i>
                                    Settings
                                </h5>
                                <p className="card-text text-muted text-center">Manage Preferences</p>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>

            <div className="container-fluid m-4 flex-center">
                <button className="btn btn-danger px-5 rounded-0" onClick={handleLogout}>Logout</button>

            </div>
        </>
    )
}

export default Account


