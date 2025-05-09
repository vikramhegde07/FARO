import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import API_BASE from '../API';

function Account({ refresh }) {
    const navigator = useNavigate();

    function handleLogout() {
        localStorage.removeItem('faro-user');
        refresh();
        navigator('/');
    }

    return (
        <>
            <div className="container p-4">
                <div className="row flex-center gap-2">
                    <div className="col-md-4">
                        <ul className='list-group'>
                            <Link to={'/profile'} className="list-group-item">Profile</Link>
                            <Link to={'/createArticle'} className="list-group-item">Publish an article</Link>
                            <Link to={'/subcriptions'} className="list-group-item">Subscriptions</Link>
                            <Link to={'#'} className='list-group-item'>Links...</Link>
                        </ul>
                    </div>
                    <div className='col-md-12 flex-center'>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Account
