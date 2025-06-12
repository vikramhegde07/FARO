import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import API_BASE from '../API';
import { formatDateOrToday } from '../utils/dateFormatter';

function EventDetails() {
    const [eventData, setEventData] = useState();
    const [registry, setRegistry] = useState([]);

    const { eventId } = useParams();

    function getEventData() {
        axios
            .get(`${API_BASE}/event/getOne/${eventId}`)
            .then((response) => {
                setEventData(response.data.eventData);
                if (response.data.registry)
                    setRegistry(response.data.registry);
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
            <div className="row">
                <div className={`${registry.length === 0 ? 'col-md-12' : 'col-md-8'} `}>
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
                </div>
                {registry.length !== 0 && (
                    <div className="col-md-4 border-start">
                        <h2 className="text-center fw-semibold fs-5">Participants <span class="badge text-bg-primary rounded-pill">{registry.length}</span></h2>
                        <hr />
                        {registry.map((user, index) => (

                            <div className="shadow p-3 rounded-3 flex-jbetween" key={user._id}>
                                <div className="">
                                    <p className=''>
                                        <b>Name:</b> {user.fullname}
                                    </p>
                                    <p className=''>
                                        <b>Email:</b> {user.email}
                                    </p>
                                </div>
                                <span className={`badge ${user.paymentStatus === 'Pending' ? 'text-danger' : 'text-indigo'}`}>Payment {user.paymentStatus}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default EventDetails
