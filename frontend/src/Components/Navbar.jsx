import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ logged }) {

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
                    <Link className="navbar-brand text-gradient-secondary fw-bolder fs-1 p-0" to={"/"}>FARO</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ "flexGrow": "0" }}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/'}>Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/about'}>About</Link>
                            </li>
                            {/* <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/#choose'}>Choose Us</Link>
                            </li> */}
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/#services'}>Services</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link text-white fs-5" to={'/islands'}>Islands</Link>
                            </li>
                            {!logged ? (
                                <li className="nav-item mx-2">
                                    <Link className="nav-link text-white fs-5" to={'/login'}>Login | Register</Link>
                                </li>
                            ) : (
                                <li className="nav-item mx-2">
                                    <Link className="nav-link text-white fs-5" to={'/account'}>Account</Link>
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
