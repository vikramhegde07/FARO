import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ refresh }) => {
    const [navActive, setNavActive] = useState(false);
    const navigator = useNavigate();

    function handleNavChange() {
        setNavActive(!navActive);
    }

    function handleLogout() {
        localStorage.removeItem('faro-user');
        localStorage.removeItem('faro-user-info');
        refresh();
        navigator('/');
    }

    return (
        <>
            <div className={`side-toggler d-block d-md-none m-1 ${navActive ? 'change' : ''} `}>
                <button className="btn px-4 py-0 bg-light fs-4 rounded-0" onClick={handleNavChange}>
                    <i className="bi bi-list"></i>
                </button>
            </div>
            <div className={`container-fluid bg-light px-0 sidebar py-3 flex-jbetween flex-column ${navActive ? 'change' : ''}`}>
                <div className="container-fluid flex-acenter flex-column gap-2">
                    <Link className="navbar-brand fw-bolder fs-1 p-0" to={"/admin"}>
                        <p className='d-inline mb-0'>F</p>
                        <p className='text-danger d-inline mb-0'>A</p>
                        <p className='d-inline mb-0'>R</p>
                        <p className='text-danger d-inline mb-0'>O</p>
                    </Link>
                    <hr className='m-0 mb-2 border border-black w-100' />
                    <Link to={'/admin'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="stats-chart-outline"></ion-icon>
                        Admin Panel
                    </Link>
                    <Link to={'/admin/islands'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <img src="/assets/img/island-icon.png" alt="" width={16} height={16} />
                        Islands
                    </Link>
                    <Link to={'/admin/articles'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="document-text-outline"></ion-icon>
                        Articles
                    </Link>
                    <Link to={'/admin/reviews'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="documents-outline"></ion-icon>
                        Article Reviews
                    </Link>
                    <Link to={'/admin/privillage'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="key-outline"></ion-icon>
                        Privillages
                    </Link>
                    <Link to={'/admin/events'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="calendar-outline"></ion-icon>
                        Events
                    </Link>
                    <Link to={'/admin/users'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="people-circle-outline"></ion-icon>
                        Users
                    </Link>

                </div>
                <div className="container-fluid flex-center flex-column gap-2">
                    <Link to={'/admin/settings'} className='w-100 py-2 ps-2 text-black text-decoration-none flex-acenter gap-2 fs-5 hover-bg-gray rounded-0'>
                        <ion-icon name="cog-outline"></ion-icon>
                        Settings
                    </Link>
                    <button className='btn btn-danger w-100 flex-acenter gap-2 fs-5 rounded-0' onClick={handleLogout}>
                        <ion-icon name="log-out-outline" className=""></ion-icon>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
