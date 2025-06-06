import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import EditPrivillage from './components/EditPrivillage';
import { useLoading } from '../Context/LoadingContext';
import { toast } from 'react-toastify';

function AddUser({ refresh, close }) {
    const { showLoading, hideLoading } = useLoading();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        newPass: '',
        confPass: '',
        phone: '',
        user_type: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleAddUser(e) {
        e.preventDefault();
        showLoading();

        if (userData.confPass !== userData.newPass) {
            toast.error("Passwords do not match");
            hideLoading();
            return;
        }

        const formData = {
            username: userData.username,
            email: userData.email,
            password: userData.newPass,
            phone: userData.phone,
            user_type: userData.user_type
        }

        axios
            .post(`${API_BASE}/user/admin/register`, formData, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("New User Added");
                    refresh();
                    hideLoading();
                    close();
                }
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Error while adding new user")
            });
        hideLoading();
    }

    return (
        <div className="my-modal">
            <div className="container bg-white p-3 overflow-y-scroll" style={{ maxWidth: '960px', maxHeight: '90vh' }}>
                <div className="px-3 pt-2 flex-jbetween flex-acenter">
                    <h1 className="fw-semibold fs-4">Add New User</h1>
                    <button
                        type='button'
                        onClick={close}
                        className="btn fs-4">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
                <hr />
                <form onSubmit={handleAddUser}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control rouned-0"
                                name='username'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control rouned-0"
                                name='email'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="newPass" className="form-label">Create Password</label>
                            <input
                                type="password"
                                className="form-control rouned-0"
                                name='newPass'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="confPass" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control rouned-0"
                                name='confPass'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                                type="number"
                                className="form-control rouned-0"
                                name='phone'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="user_type" className="form-label">User Type</label>
                            <select class="form-select" name='user_type' onChange={handleChange}>
                                <option selected>Select</option>
                                <option value="reader">Normal User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <hr />
                    <div className="flex-jend gap-2">
                        <button
                            type='button'
                            className="btn btn-dark rounded-0 px-3"
                            onClick={close}
                        >
                            Close
                        </button>
                        <button
                            type='submit'
                            className="btn btn-danger px-3 rounded-0">
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Users() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [editPriv, setEditPriv] = useState(false);
    const [addUser, setAddUser] = useState(false);

    const [tab, setTab] = useState('reader');

    const [privUser, setPrivUser] = useState({
        id: '',
        username: '',
        email: '',
        privs: ''
    });

    const closeEdit = () => setEditPriv(false);
    const closeUser = () => setAddUser(false);

    function getuserList() {
        setUsers([]);
        axios
            .get(`${API_BASE}/user`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getuserList();
    }, [])

    useEffect(() => {
        if (searchKey.trim() === '') {
            setSearch(false);
            setSearchResults([]);
        } else {
            setSearch(true);

            const searchLower = searchKey.toLocaleLowerCase();

            const matched = users.filter(user =>
                user.username.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );

            setSearchResults(matched);
        }
    }, [searchKey])

    return (
        <>
            <div className='admin-content px-2 mt-5'>
                <h1 className="text-center fw-bold fs-2">Manage Users</h1>
                <hr />
                <div className="container-fluid flex-jbetween flex-md-row flex-column px-4 py-3 mt-2">
                    <h3 className="fs-5">{!search ? 'All Users' : 'Search Results'}</h3>
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Search Users"
                            value={searchKey}
                            name="search"
                            id="search"
                            onChange={(e) => { setSearchKey(e.target.value) }}
                        />
                    </div>
                </div>
                <hr />

                {search ? (
                    <>
                        {searchResults.length === 0 ? '' : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Privillages</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((user, index) => (
                                        <tr key={user._id}>
                                            <th scope="row">{index}</th>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button
                                                    type='button'
                                                    className="btn btn-danger rounded-0 px-4"
                                                    onClick={(e) => {
                                                        setPrivUser({
                                                            id: user._id,
                                                            username: user.username,
                                                            email: user.email,
                                                            privs: user.privillage
                                                        });
                                                        setEditPriv(true);
                                                    }}
                                                >Edit Privillage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <>
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <button
                                    type='button'
                                    onClick={() => { setTab('admin') }}
                                    class={`nav-link ${tab === 'admin' ? 'active' : ''}`}
                                >
                                    Admin Users
                                </button>
                            </li>
                            <li class="nav-item">
                                <button
                                    type='button'
                                    onClick={() => { setTab('reader') }}
                                    class={`nav-link ${tab === 'reader' ? 'active' : ''}`}
                                >
                                    All Users
                                </button>
                            </li>
                        </ul>
                        {users.length === 0 ? '' : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Privillages</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <>
                                            <tr key={user._id}>
                                                <th scope="row">{index}</th>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <button
                                                        type='button'
                                                        className="btn btn-danger rounded-0 px-4"
                                                        onClick={(e) => {
                                                            setPrivUser({
                                                                id: user._id,
                                                                username: user.username,
                                                                email: user.email,
                                                                privs: user.privillage
                                                            });
                                                            setEditPriv(true);
                                                        }}
                                                    >Edit Privillage</button>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
                {editPriv && <EditPrivillage privUser={privUser} close={closeEdit} refresh={getuserList} />}
                {addUser && <AddUser refresh={getuserList} close={closeUser} />}
            </div>
            <div className="position-absolute top-0 end-0 pt-4 pe-4">
                <button
                    type='button'
                    onClick={() => { setAddUser(true) }}
                    className="btn btn-danger px-3 rounded-0 flex-acenter gap-2"
                >
                    <ion-icon name="add-outline" ></ion-icon>
                    Add New User
                </button>
            </div>
        </>
    )
}

export default Users
