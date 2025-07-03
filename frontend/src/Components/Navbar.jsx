import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ logged, refresh }) {
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

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [logged]);

    return (
        <>
            <nav className={`navbar navbar-expand-lg bg-dark`} data-bs-theme="dark">
                <div className="container-fluid w-75">
                    <Link className="navbar-brand text-gradient-secondary fw-bolder fs-1 p-0" to={"/"}>
                        <img src="/assets/img/Logo.jpg" alt="" width={30} height={50} className="d-inline-block align-text-top me-2" />
                        FAROPORT
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ "flexGrow": "0" }}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg- align-items-center">
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/'}>Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/islands'}>Islands</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/pricing'}>Pricing</Link>
                            </li>
                            {!logged ? (
                                <li className="nav-item mx-2">
                                    <Link className="btn btn-danger px-4 rounded-0" to={'/login'}>Login</Link>
                                </li>
                            ) : (
                                <li className="nav-item dropdown">
                                    <Link className="nav-link" to="#" role="button" data-bs-toggle="dropdown" data-bs-theme="light" aria-expanded="false">
                                        <img src={userInfo?.profile_pic} alt="" width={42} height={42} style={{ borderRadius: "50%" }} />
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to={'/account/profile'}>Profile</Link></li>
                                        {userInfo?.privillage.includes('write') && (
                                            <li><Link className="dropdown-item" to={'/createArticle'}>Create Article</Link></li>
                                        )}
                                        {userInfo?.privillage.includes('review') && (
                                            <li><Link className="dropdown-item" to={'/review'}>Review Articles</Link></li>
                                        )}
                                        <li><Link className="dropdown-item" to={'/account/subscriptions'}>Subscriptions</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button type='button' onClick={handleLogout} className="dropdown-item btn btn-danger">Logout</button></li>
                                    </ul>
                                </li>
                            )}

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
