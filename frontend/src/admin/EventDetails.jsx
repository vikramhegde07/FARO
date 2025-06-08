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
        <>
            <h2 className="text-center fw-semibold">{eventData.title}</h2>
            <hr />
            {eventData.content.map((item) => (
                <div key={item._id}>
                    {item.type == 'paragraph' ? (
                        <p className='fs-18'>{item.value}</p>
                    ) : item.type == 'points' ? (
                        <ol>
                            {item.value.map((point) => (
                                <li className='fs-6'>{point}</li>
                            ))}
                        </ol>
                    ) : item.type == 'image' ? (
                        <div className='flex-center'>
                            <img src={item.value} alt="" className='img-fluid' style={{ maxHeight: '70vh' }} />
                        </div>
                    ) : item.type == 'heading' ? (
                        <h1 className='fw-bold fs-1'>{item.value}</h1>
                    ) : item.type == 'subheading' ? (
                        <h3 className='fw-semibold fs-3'>{item.value}</h3>
                    ) : item.type == 'link' ? (
                        <a href={item.value.href} className='d-block'>{item.value.text}</a>
                    ) : ''}
                </div>
            ))}
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
        </>
    )
}

export default EventDetails
