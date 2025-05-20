import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE from '../API';

function Profile() {
    const [enableEdit, setEnableEdit] = useState(false);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigator = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const updateImage = () => {
        if (!selectedFile) {
            return setMessage('Please select a file first.');
        }
        const formData = new FormData();
        formData.append('image', selectedFile);

        axios
            .post(`${API_BASE}/user/update/auth/prof_pic`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token
                },
            })
            .then((response) => {
                console.log(response.data);
                localStorage.removeItem('faro-user-info');
                setSelectedFile(null);
                getUserData();
            })
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleProfileUpdate(e) {
        e.preventDefault();

        const formData = {
            username: userData.username,
            email: userData.email,
            phone: userData.phone
        }

        axios
            .patch(`${API_BASE}/user/update/auth/profile`, formData, {
                headers: {
                    Authorization: token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Profile Data updated successfully!')
                    getUserData();
                }
            })
            .catch((error) => {
                console.log(error.data);
                toast.error("Sorry! Error while updating profile")
            })

    }

    function getUserData() {
        setUserData(null);
        axios
            .get(`${API_BASE}/user/getOne`, {
                headers: {
                    Authorization: token
                }
            })
            .then((response) => {
                localStorage.removeItem('faro-user');
                localStorage.removeItem('faro-user-info');
                localStorage.setItem('faro-user', response.data.token);
                localStorage.setItem('faro-user-info', JSON.stringify(response.data.userData));
                setToken(response.data.token);
                setEnableEdit(false);
                parseUserData();
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    function parseUserData() {
        const userInfo = localStorage.getItem('faro-user-info');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUserData(parsedUser);
                console.log(parsedUser);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        } else {
            toast.error("Sorry! check your login once again. Token not found or expired")
            navigator('/')
        }
    }

    const handlePicRemoval = () => {
        axios
            .delete(`${API_BASE}/user/delete/auth/remove_pic`, {
                headers: {
                    Authorization: token
                }
            })
            .then((response) => {
                if (response.status === 200)
                    getUserData();
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        setToken(localStorage.getItem('faro-user'));
        parseUserData();
    }, [])

    return (
        <div className='container-fluid mt-5 p-3'>
            <h3 className="text-center fst-italic fw-semibold">User Profile</h3>
            <hr />
            {!userData ? '' : (
                <div className="container">
                    <div className="row flex-center gap-3 p-3">
                        <div className="col-md-4">
                            <img src={`${userData.profile_pic == '' ? '/assets/img/user.png' : userData.profile_pic}`} alt="" className="img-fluid" />
                            <input
                                type="file"
                                name="profileImage"
                                id="profileImage"
                                className="d-none"
                                onChange={handleFileChange}
                            />
                            <div className='flex-center gap-3 mt-2'>
                                {selectedFile ? (
                                    <button
                                        type='button'
                                        onClick={updateImage}
                                        className="btn btn-danger flex-acenter gap-2 px-4 rounded-0"

                                    >
                                        <ion-icon name="sync-outline" ></ion-icon>
                                        Update
                                    </button>
                                ) : (
                                    <>
                                        <label htmlFor="profileImage" className="btn btn-primary flex-center gap-2 px-4 rounded-0">
                                            <ion-icon name="pencil-outline"></ion-icon>
                                            Change
                                        </label>
                                    </>
                                )}

                                {userData.profile_pic === '' ? '' : selectedFile ? (
                                    <button
                                        type='button'
                                        onClick={() => { setSelectedFile(null) }}
                                        className="btn btn-dark flex-acenter gap-2 px-4 rounded-0"

                                    >
                                        <ion-icon name="close-outline"></ion-icon>
                                        Cancel
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type='button'
                                            onClick={handlePicRemoval}
                                            className="btn btn-danger flex-center gap-2 px-4 rounded-0">
                                            <ion-icon name="trash-outline"></ion-icon>
                                            Remove Profile Image
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="vr p-0 border border-black"></div>
                        <div className="col-md-4">
                            <form onSubmit={handleProfileUpdate}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        name='username'
                                        id='username'
                                        value={userData.username}
                                        className="form-control rounded-0"
                                        onChange={handleChange}
                                        disabled={!enableEdit ? 'disabled' : ''}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name='email'
                                        id='email'
                                        value={userData.email}
                                        className="form-control rounded-0"
                                        onChange={handleChange}
                                        disabled={!enableEdit ? 'disabled' : ''}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input
                                        type="number"
                                        name='phone'
                                        id='phone'
                                        value={userData.phone}
                                        className="form-control rounded-0"
                                        onChange={handleChange}
                                        disabled={!enableEdit ? 'disabled' : ''}
                                    />
                                </div>
                                <div className="flex-jend gap-3">
                                    <button
                                        type='button'
                                        className={`btn flex-acenter gap-2 px-4 rounded-0 ${!enableEdit ? 'btn-primary' : 'btn-dark'}`}
                                        onClick={() => { setEnableEdit(!enableEdit) }}
                                    >
                                        {!enableEdit ? (
                                            <>
                                                <ion-icon name="pencil-outline"></ion-icon>
                                                Edit
                                            </>
                                        ) : (
                                            <>
                                                <ion-icon name="close-outline"></ion-icon>
                                                Cancel
                                            </>
                                        )

                                        }

                                    </button>
                                    <button
                                        type='submit'
                                        className="btn btn-danger flex-acenter gap-2 px-4 rounded-0"
                                        disabled={!enableEdit ? 'disabled' : ''}

                                    >
                                        <ion-icon name="sync-outline" ></ion-icon>
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
