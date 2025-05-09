import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminSideBar({ refresh }) {
    const navigator = useNavigate();

    function handleLogout() {
        localStorage.removeItem('faro-user');
        localStorage.removeItem('faro-user-type');
        refresh();
        navigator('/');
    }
    return (
        <>
            <div className='container bg-gradient-dark border-end border-black sidebar-pos flex-jbetween flex-column overflow-y-auto' style={{ maxWidth: "200px" }}>
                <div className="d-flex flex-column py-4">
                    <div className="mb-4">
                        <div className="flex-center fw-bolder fs-1">
                            <p className="d-inline text-white mb-0">F</p>
                            <p className="d-inline text-danger mb-0">A</p>
                            <p className="d-inline text-white mb-0">R</p>
                            <p className="d-inline text-danger mb-0">O</p>
                        </div>
                        <hr className='w-100 border border-white m-0' />
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin'} className='btn text-white'>Dashboard</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/islands'} className='btn text-white'>Islands</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/articles'} className='btn text-white'>Articles</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/privillages'} className='btn text-white'>Privillages</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/users'} className='btn text-white'>Users</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/settings'} className='btn text-white'>Settings</Link>
                    </div>
                    <div className="mb-3">
                        <Link to={'/admin/settings'} className='btn text-white'>Profile</Link>
                    </div>
                    <div className="mb-3">
                        <button className='btn text-white' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSideBar
