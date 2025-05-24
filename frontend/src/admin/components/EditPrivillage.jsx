import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../../API';
import { toast } from 'react-toastify';

function EditPrivillage({ privUser, refresh, close }) {
    const [privillages, setPrivillages] = useState(['write', 'review', 'edit']);

    function addPriv(e) {
        axios
            .patch(`${API_BASE}/user/update/privillage`, {
                action: 'allow',
                userId: privUser.id,
                privillage: e.target.value
            }, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 200)
                    toast.success('Added privillage Successfully!');
                refresh();
                close();
            })
            .catch((error) => {
                console.log(error.response);
                toast.error('Some Error happened check log for more info');
            })
    }

    function removePriv(e) {
        axios
            .patch(`${API_BASE}/user/update/privillage`, {
                action: 'revoke',
                userId: privUser.id,
                privillage: e.target.value
            }, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 200)
                    toast.success('Removed privillage Successfully!');
                refresh();
                close();
            })
            .catch((error) => {
                console.log(error.response);
                toast.error('Some Error happened check log for more info');
            })
    }

    return (
        <div className="my-modal position-fixed">
            <div className="col-4 bg-white p-4">
                <div className="flex-jbetween">
                    <h1 className="text-center fs-3">Edit Privillages</h1>
                    <ion-icon
                        name="close-outline"
                        className="text-black-50 fs-2 cursor-pointer"
                        onClick={() => { close(); }}
                    ></ion-icon>
                </div>
                <hr />
                <p className='fs-4 fw-semibolf'> Click on privillages to grant / revoke privillages</p>
                <div>
                    <p className="fs-5 fw-semibold d-inline">Username: </p>
                    <p className='fs-5 d-inline'>{privUser.username}</p>
                </div>
                <div>
                    <p className="fs-5 fw-semibold d-inline">Email: </p>
                    <p className='fs-5 d-inline'>{privUser.email}</p>
                </div>
                <hr />
                <div className="flex-center gap-3 mt-2">
                    {privillages.map(priv => (
                        <>
                            {privUser.privs.some((privillage) => priv === privillage) ? (
                                <>
                                    <button
                                        type='button'
                                        onClick={removePriv}
                                        value={priv}
                                        className="btn btn-danger rounded-0 flex-acenter gap-2 text-capitalize"

                                    >
                                        <ion-icon name="remove-circle-outline"></ion-icon>
                                        {priv}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type='button'
                                        onClick={addPriv}
                                        value={priv}
                                        className="btn btn-primary rounded-0 flex-acenter gap-2 text-capitalize"

                                    >
                                        {priv}
                                        <ion-icon name="add-outline"></ion-icon>
                                    </button>
                                </>
                            )}
                        </>
                    ))}
                </div>
                <hr />
                <div className="flex-jend">
                    <button
                        type='button'
                        onClick={close}
                        className="btn btn-dark rounded-0 px-3"
                    >Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditPrivillage;