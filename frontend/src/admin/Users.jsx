import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import EditPrivillage from './components/EditPrivillage';

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [editPriv, setEditPriv] = useState(false);

    const [privUser, setPrivUser] = useState({
        id: '',
        username: '',
        email: '',
        privs: ''
    });

    const closeEdit = () => setEditPriv(false);

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
        <div className='admin-content px-2'>
            <h1 className="text-center fw-bold fs-2">Manage Users</h1>
            <hr />
            <div className="container-fluid flex-jbetween flex-md-row flex-column px-4 py-3 mt-4">
                <h3 className="fs-5">{!search ? 'All Users' : 'Search Results'}</h3>
                <div className="d-flex gap-2">
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
            )}
            {editPriv && <EditPrivillage privUser={privUser} close={closeEdit} refresh={getuserList} />}
        </div>
    )
}

export default Users
