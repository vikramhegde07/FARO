import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import { Link } from 'react-router-dom';
import { formatDateOrToday } from '../utils/dateFormatter';

function Events() {
    const [events, setEvents] = useState([]);

    function getEventList() {
        setEvents([]);
        axios
            .get(`${API_BASE}/event/upcoming`)
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    useEffect(() => {
        getEventList();
    }, [])

    return (
        <>
            <div className='admin-content px-2 mt-4'>
                <h2 className="text-center fw-bold">Manage Events</h2>
                <hr />
                <div className="container-fluid px-3 py-2">
                    <div className="flex-jbetween flex-md-row flex-column-reverse gap-3 gap-md-0">
                        <h5 className="fs-5 fw-semibold">Upcoming Events</h5>
                        <div>
                            <Link to={'/admin/addEvent'} className="btn btn-danger px-4 rounded-0 flex-acenter gap-2">
                                <i className="bi bi-calendar-plus"></i>
                                Schedule an Event
                            </Link>
                        </div>
                    </div>
                    <hr />
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Event Name</th>
                                <th scope="col">Event Date</th>
                                <th scope="col">Location</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        {events.length === 0 ? '' : (
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={event._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            <Link to={`/admin/event/${event._id}`} className='hover-decoration text-black'>
                                                {event.title}
                                            </Link>
                                        </td>
                                        <td>{formatDateOrToday(event.eventDate)}</td>
                                        <td>{event.location}</td>
                                        <td>
                                            <div className="dropdown">
                                                <button className="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><button className="dropdown-item" href="#">Action</button></li>
                                                    <li><button className="dropdown-item" href="#">Another action</button></li>
                                                    <li><button className="dropdown-item" href="#">Something else here</button></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    )
}

export default Events
