import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE from '../API';
import axios from 'axios';
import { toast } from 'react-toastify';


function RegisterForm({ changeForm }) {

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        newPass: '',
        confPass: '',
    });
    const navigator = useNavigate();
    const [regError, setRegError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }))
    };


    function handleRegister(e) {
        e.preventDefault();

        const isPassword = registerData.newPass === registerData.confPass;
        if (!isPassword) {
            setRegError('Passwords do not match');
        } else {
            const formData = {
                username: registerData.username,
                email: registerData.email,
                password: registerData.newPass,
                user_type: registerData.user_type
            }

            axios
                .post(`${API_BASE}/user/register`, formData)
                .then((response) => {
                    console.log(response.data);
                    toast.success("Registered Successfully!")
                    if (response.status == 201) {
                        changeForm('login');
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                    toast.error('Error while registering');
                    setRegError(error.response.data.error);
                });
        }

    }
    return (
        <>
            <div className="container-fluid mt-4">
                <h1 className="text-center fs-3 fw-semibold">Ready to Explore?</h1>
                <p className="text-center text-black-50 fs-6">Sign up and dive into curated topics, expert tips, and real-world tools.</p>
            </div>

            <form onSubmit={handleRegister} className="p-3">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className='form-control rounded-0'
                        id='username'
                        name='username'
                        onChange={handleChange}
                    />
                </div>
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
                    <label htmlFor="newPass" className="form-label">Create New Password</label>
                    <input
                        type="password"
                        className="form-control rounded-0"
                        id='newPass'
                        name='newPass'
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confPass" className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control rounded-0"
                        id='confPass'
                        name='confPass'
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-center">
                    <button
                        type="submit"
                        className='btn btn-danger rounded-0 px-5 mt-3'
                    >Sign Up</button>
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
                <p className="fs-xsmall">By Signing Up, you agree to our <Link to={'/terms'} className='text-decoration-none'>Terms and Conditions</Link></p>
                <div>
                    <p className='fs-xsmall mb-0 text-center'>Already have an account?</p>
                    <p onClick={() => { changeForm('login') }} className='text-primary fs-xsmall text-center cursor-pointer'>Sign In</p>
                </div>
            </div>
        </>
    )
}

export default RegisterForm
