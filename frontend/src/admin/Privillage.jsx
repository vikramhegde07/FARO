import React, { useState } from 'react'
import NewReq from './components/NewReq';
import AccessList from './components/AccessList';

function Privillage() {

    const [tab, setTab] = useState('accessList');

    return (
        <div className='admin-content px-2'>
            <h1 className="text-center fw-bold fs-2">Manage User Privillages</h1>
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

        </div>
    )
}

export default Privillage
