import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import API_BASE from '../API';
import { formatDateOrToday } from '../utils/dateFormatter';

function EventDetails() {
    const [eventData, setEventData] = useState();

    const { eventId } = useParams();

    function getEventData() {
        axios
            .get(`${API_BASE}/event/getOne/${eventId}`)
            .then((response) => {
                setEventData(response.data)
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    useEffect(() => {
        getEventData();
    }, [])

    if (!eventData)
        return ''

    return (
        <div className='container px-5 py-3 mt-lg-4 mt-2'>
            <h1 className="text-center fw-semibold fs-4">{eventData.title}</h1>
            <hr />
            <p className="fs-5" style={{ whiteSpace: 'pre-wrap' }}>{eventData.desc}</p>
            <br />
            <span>
                <p className='fw-semibold fs-5 d-inline'>Event Date : </p>
                <p className="fst-italic d-inline">{formatDateOrToday(eventData.eventDate)}</p>
            </span>
            <br />
            <span>
                <p className='fw-semibold fs-5 d-inline'>Location : </p>
                <p className="fst-italic d-inline">{eventData.location}</p>
            </span>
        </div>
    )
}

export default EventDetails
