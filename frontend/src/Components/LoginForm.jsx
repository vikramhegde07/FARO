import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_BASE from '../API';
import { toast } from 'react-toastify';

function LoginForm({ changeForm, refresh }) {

    const navigator = useNavigate();
    const [loginError, setLoginError] = useState(null);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            email: loginData.email,
            password: loginData.password
        }
        console.log(formData);


        axios
            .post(`${API_BASE}/user/login`, formData)
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data.token;
                    localStorage.setItem('faro-user', token);
                    localStorage.setItem('faro-user-info', JSON.stringify(response.data.User));
                    toast.success("Logged in successfully!");
                    refresh();
                    if (response.data.User.user_type == 'admin')
                        navigator('/admin');
                    else
                        navigator('/islands');
                }

            })
            .catch((error) => {
                toast.error('Error while logging in!')
                console.log(error.response);
                setLoginError(error.response.data.error);
            })
    }

    return (
        <>
            <div className="container-fluid mt-4">
                <h1 className="text-center fs-3 fw-semibold">Welcome Back</h1>
                <p className="text-center text-black-50 fs-6">It's Nice to see you again</p>
            </div>

            <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className='form-control rounded-0'
                        id='email'
                        name='email'
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control rounded-0"
                        name='password'
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 d-flex justify-content-lg-between justify-content-center flex-lg-row flex-column">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value={true}
                            id="remember"
                        />
                        <label className="form-check-label" htmlFor="remember">Remember me</label>
                    </div>
                    <Link to={'/forgottenPassword'} className='text-decoration-none'>Forgotten Password?</Link>
                </div>
                <div className="flex-center">
                    <button
                        type="submit"
                        className='btn btn-danger rounded-0 px-5 mt-3'
                    >Sign In</button>
                </div>
            </form>
            <div className="container-fluid pb-3">
                <p className="fs-small text-center">--Or Continue With--</p>
                <div className="flex-center gap-3">
                    <div className="cursor-pointer">
                        <i className="bi bi-google fs-3 text-danger"></i>
                    </div>
                    <div className="cursor-pointer">
                        <i className="bi bi-facebook fs-3 text-primary"></i>
                    </div>
                    <div className="cursor-pointer">
                        <i className="bi bi-github fs-3"></i>
                    </div>

                </div>
            </div>
            <div className="container flex-center flex-column gap-2">
                <p className="fs-xsmall">By Signing In, you agree to our <Link to={'/terms'} className='text-decoration-none'>Terms and Conditions</Link></p>
                <div>
                    <p className='fs-xsmall mb-0 text-center'>New to FARO?</p>
                    <p onClick={() => { changeForm('register') }} className='text-primary fs-xsmall text-center cursor-pointer'>Create an Account</p>
                </div>
            </div>
        </>
    )
}

export default LoginForm
