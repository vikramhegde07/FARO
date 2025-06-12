import axios from 'axios';
import { useEffect, useState } from 'react'
import API_BASE from '../API';
import EditPrivillage from './components/EditPrivillage';
import { useLoading } from '../Context/LoadingContext';
import { toast } from 'react-toastify';
import { formatDateOrToday } from '../utils/dateFormatter';

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
                            <select className="form-select" name='user_type' onChange={handleChange}>
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

function AddSubscription({ close, user }) {
    const [islands, setIslands] = useState([]);
    const [chosenIsland, setChosenIsland] = useState('');
    const [expiry, setExpiry] = useState();

    function getIslands() {
        axios
            .get(`${API_BASE}/island`)
            .then((response) => {
                setIslands(response.data);
            })
            .catch((error) => {
                console.log(error.reponse);
            })
    }

    function handleChange(e) {
        setChosenIsland(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (chosenIsland === '')
            return toast.error("Choose island");

        const formData = {
            userId: user._id,
            islandId: chosenIsland,
        }
        axios
            .post(`${API_BASE}/subscription/admin/create`, formData, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 201)
                    toast.success("Added new Subscription");
                close();
            })
            .catch((err) => {
                console.log(err.reponse);
            });
    }

    useEffect(() => {
        getIslands();
        let now = new Date();
        let expiresIn = new Date(now);
        expiresIn.setMonth(expiresIn.getMonth() + 1)
        setExpiry(expiresIn);
    }, [])
    return (
        <>
            <div className="my-modal">
                <div className="container bg-white p-3 overflow-y-scroll" style={{ maxWidth: '960px', maxHeight: '90vh' }}>
                    <div className="px-3 pt-2 flex-jbetween flex-acenter">
                        <h1 className="fw-semibold fs-4">Add New Subscription</h1>
                        <button
                            type='button'
                            onClick={close}
                            className="btn fs-4">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <div className="flex-jcenter flex-column gap-2">
                            <h2 className="fs-5"><b>User: </b>{user.username}</h2>
                            <h2 className="fs-5"><b>Email: </b>{user.email}</h2>
                            <div className="mb-3">
                                <label htmlFor="island" className="form-label">Select Island</label>
                                <select
                                    name="island"
                                    id="island"
                                    className='form-select'
                                    style={{ maxWidth: '24rem' }}
                                    onChange={handleChange}
                                >
                                    <option selected>Choose</option>
                                    {islands.map((island) => (
                                        <option value={island._id} key={island._id}>{island.title}</option>
                                    ))}
                                </select>
                            </div>
                            <p className='fs-5'>The Subscription will be valid till : <b>{formatDateOrToday(expiry)}</b></p>
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
                                Add Subscription
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </>
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
    const [subscrUser, setSubscrUser] = useState(false);

    const [tab, setTab] = useState('reader');
    const { showLoading, hideLoading } = useLoading();

    const [privUser, setPrivUser] = useState({
        id: '',
        username: '',
        email: '',
        privs: ''
    });
    const [subscrUserData, setSubscrUserData] = useState({});

    const closeEdit = () => setEditPriv(false);
    const closeUser = () => setAddUser(false);
    const closeSubscr = () => setSubscrUser(false);

    function getuserList() {
        setAllUsers([]);
        axios
            .get(`${API_BASE}/user`)
            .then((response) => {
                setAllUsers(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    function userFilter() {
        let newData = [];
        allUsers.forEach((user) => {
            if (user.user_type === tab)
                newData.push(user);
        });
        setUsers(newData);
    }

    useEffect(() => {
        showLoading();
        getuserList();
        hideLoading();
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

    useEffect(() => {
        userFilter();
    }, [allUsers, tab])

    return (
        <>
            <h2 className="text-center fw-semibold">Manage Users</h2>
            <hr />
            <div className="container-fluid flex-jbetween flex-md-row flex-column px-4 mt-2">
                <h3 className="fs-5 fw-semibold">{!search ? 'Users' : 'Search Results'}</h3>
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
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <div className="dropdown">
                                                <button className="btn btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li>
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
                                                    </li>
                                                    <li>
                                                        <button
                                                            type='button'
                                                            className="dropdown-item flex-acenter gap-2"
                                                            onClick={(e) => {
                                                                setSubscrUser(true);
                                                                setSubscrUserData(user)
                                                            }}
                                                        >
                                                            <i class="bi bi-currency-rupee"></i>
                                                            Add Subscription
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            ) : (
                <>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button
                                type='button'
                                onClick={() => { setTab('reader') }}
                                className={`nav-link ${tab === 'reader' ? 'active' : ''}`}
                            >
                                All Users
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type='button'
                                onClick={() => { setTab('admin') }}
                                className={`nav-link ${tab === 'admin' ? 'active' : ''}`}
                            >
                                Admins
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type='button'
                                onClick={() => { setTab('author') }}
                                className={`nav-link ${tab === 'author' ? 'active' : ''}`}
                            >
                                Authors
                            </button>
                        </li>
                    </ul>
                    {users.length !== 0 && (
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
                                    <tr key={user._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <div className="dropdown">
                                            <button className="btn btn-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button
                                                        type='button'
                                                        className="dropdown-item flex-acenter gap-2"
                                                        onClick={(e) => {
                                                            setPrivUser({
                                                                id: user._id,
                                                                username: user.username,
                                                                email: user.email,
                                                                privs: user.privillage
                                                            });
                                                            setEditPriv(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-pen"></i>
                                                        Edit Privillage
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type='button'
                                                        className="dropdown-item flex-acenter gap-2"
                                                        onClick={(e) => {
                                                            setSubscrUser(true);
                                                            setSubscrUserData(user)
                                                        }}
                                                    >
                                                        <i class="bi bi-currency-rupee"></i>
                                                        Add Subscription
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
            {editPriv && <EditPrivillage privUser={privUser} close={closeEdit} refresh={getuserList} />}
            {addUser && <AddUser refresh={getuserList} close={closeUser} />}
            {subscrUser && <AddSubscription user={subscrUserData} close={closeSubscr} />}
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
