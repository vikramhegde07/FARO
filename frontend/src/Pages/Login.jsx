import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import RegisterForm from '../Components/RegisterForm';
import LoginForm from '../Components/LoginForm';

function Login({ refresh }) {

    const [form, setForm] = useState('login');

    function changeForm(value) {
        setForm(value);
    }
    useEffect(() => { }, [form])
    return (
        <>
            <div className="container-fluid px-lg-4 px-0 py-2">
                <div className="row">
                    <div className="col-md-4 bg-light">
                        <Link className="navbar-brand fw-bolder fs-1 p-0" to={"/"}>
                            <p className='d-inline mb-0'>F</p>
                            <p className='text-danger d-inline mb-0'>A</p>
                            <p className='d-inline mb-0'>R</p>
                            <p className='text-danger d-inline mb-0'>O</p>
                        </Link>
                        {
                            form == 'login' ?
                                <LoginForm changeForm={changeForm} refresh={refresh} />
                                :
                                <RegisterForm changeForm={changeForm} />
                        }
                        <div className="border-top flex-jbetween position-relative bottom-0 py-1 mt-4">
                            <Link to={''} className="fs-xsmall text-decoration-none mb-0 text-black">Privacy</Link>
                            <Link to={''} className="fs-xsmall text-decoration-none mb-0 text-black">Security</Link>
                            <p className="fs-xsmall mb-0 text-black">&copy;2025 FARO. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Login
