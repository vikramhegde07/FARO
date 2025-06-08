import React, { useState } from 'react'
import NewReq from './components/NewReq';
import AccessList from './components/AccessList';

function Privillage() {

    const [tab, setTab] = useState('accessList');

    return (
        <>
            <h2 className="text-center fw-semibold">Manage User Privillages</h2>
            <hr />
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        onClick={() => { setTab('accessList') }}
                        type='button'
                        className={`nav-link text-black ${tab === 'accessList' ? 'active' : ''}`}
                        aria-current="page"
                    >Access List</button>
                </li>
                <li className="nav-item">
                    <button
                        type='button'
                        onClick={(e) => { setTab('newReq') }}
                        className={`nav-link text-black ${tab === 'newReq' ? 'active' : ''}`}
                    >Requests</button>
                </li>
            </ul>
            {tab === 'accessList' ? <AccessList /> : <NewReq />}

        </>
    )
}

export default Privillage
