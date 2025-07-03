import React, { useEffect, useState } from 'react'
import { useLoading } from '../Context/LoadingContext';
import axios from 'axios';
import API_BASE from '../API';
import { formatDateOrToday } from '../utils/dateFormatter';

function Subscription() {
    const [activeSubs, setActiveSubs] = useState([]);
    const [expSubs, setExpSubs] = useState([]);
    const { showLoading, hideLoading } = useLoading();

    function getSubscriptions() {
        showLoading();
        axios
            .get(`${API_BASE}/subscription/user`, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((res) => {
                setActiveSubs(res.data.active)
                setExpSubs(res.data.expired)
            })
            .catch((err) => {
                console.log(err.response);
            })
        hideLoading();
    }

    useEffect(() => {
        getSubscriptions();
    }, [])

    return (
        <div className='container-fluid mt-4 p-3'>
            <h2 className="text-center fs-2 fw-semibold">Your Subscriptions</h2>
            <hr />
            {activeSubs.length > 0 && (
                <div className="row">
                    <h3 className="fs-4 fw-semibold text-indigo">Active Subscriptions</h3>
                    {activeSubs.map(sub => (
                        <div className="col-md-3 p-2" key={sub._id}>
                            <div className="border border-black-50 p-3 bg-info-subtle rounded-3">
                                <p className="fs-5 fw-semibold">Island: <span className='fw-normal'>{sub.islandId.title}</span> </p>
                                <p className="fs-5 fw-semibold">Purchased On: <span className='fw-normal'>{formatDateOrToday(sub.createdAt)}</span> </p>
                                <p className="fs-5 fw-semibold">Expiring On: <span className='fw-normal'>{formatDateOrToday(sub.expiresIn)}</span> </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {expSubs.length > 0 && (
                <div className="row">
                    <h3 className="fs-4 fw-semibold text-indigo">Subscription History</h3>
                    {expSubs.map(sub => (
                        <div className="col-md-3 p-2" key={sub._id}>
                            <div className="border border-black-50 p-3 bg-info-subtle rounded-3">
                                <p className="fs-5 fw-semibold">Island: <span className='fw-normal'>{sub.islandId.title}</span> </p>
                                <p className="fs-5 fw-semibold">Purchased On: <span className='fw-normal'>{formatDateOrToday(sub.createdAt)}</span> </p>
                                <p className="fs-5 fw-semibold">Expiring On: <span className='fw-normal'>{formatDateOrToday(sub.expiresIn)}</span> </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Subscription
