import React, { useEffect, useState } from 'react'
import API_BASE from '../../API';
import axios from 'axios';

function NewReq() {
    const [req, setReq] = useState([]);
    const [error, setError] = useState(null)

    function getNewRequests() {
        axios
            .get(`${API_BASE}/access`, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                setReq(response.data);
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status === 404)
                    setError("No new requests.");
            })
    }

    useEffect(() => {
        getNewRequests();
    }, [])
    return (
        <div className='container px-3 py-5 mt-2'>
            {error ? (
                <>
                    <h1 className="text-center fw-semibold fs-2">{error}</h1>
                </>
            ) : ''}

            {req.length === 0 ? '' : (
                <>

                </>
            )}
        </div>
    )
}

export default NewReq
