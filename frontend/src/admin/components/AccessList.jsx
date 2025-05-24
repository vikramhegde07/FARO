import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../../API';
import { toast } from 'react-toastify';
import EditPrivillage from './EditPrivillage';

function AccessList() {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);

    const [edit, setEdit] = useState(false);

    const closeEdit = () => setEdit(false);

    const [privUser, setPrivUser] = useState({
        id: '',
        username: '',
        email: '',
        privs: ''
    });

    function getList() {
        setList([]);
        axios
            .get(`${API_BASE}/user/privillaged`)
            .then((response) => {
                setList(response.data);
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status === 404)
                    setError("No users found with special privillages")
            })
    }

    useEffect(() => {
        getList();
    }, [])

    return (
        <div className='container px-3 py-5 mt-2'>

            {!error ? '' : (
                <>
                    <h1 className="text-center fw-semibold fs-2">{error}</h1>
                </>
            )}

            {list.length === 0 ? '' : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Privillages</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((user, index) => (
                                <tr key={user._id}>
                                    <th scope="row">{index}</th>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.privillage.map((item, index) => (
                                            <>
                                                {item === 'read' ? '' : <div key={index}>{item}</div>}
                                            </>
                                        ))}
                                    </td>
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
                                                setEdit(true);
                                            }}
                                        >Edit Privillage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {edit && <EditPrivillage privUser={privUser} close={closeEdit} refresh={getList} />}
        </div>
    )
}

export default AccessList
