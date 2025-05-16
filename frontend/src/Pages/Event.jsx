import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import { Link } from 'react-router-dom';
import { formatDateOrToday } from '../utils/dateFormatter';

function Event() {
    const [events, setEvents] = useState([]);


    function getUpcomingEvents() {
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
        getUpcomingEvents();
    }, [])

    return (
        <div className='container-fluid px-3 py-3 mt-3'>
            <h1 className="fw-semibold fs-4">Upcoming Events</h1>
            <hr />
            <div className="row gap-3">
                {events.length === 0 ? '' :
                    events.map((event) => (
                        <div className="col-md-3" key={event._id}>
                            <div className="card shadow">
                                <div className="card-header flex-jbetween">
                                    <p className="card-text mb-0">Upcoming </p>
                                    <p className="card-text mb-0">{formatDateOrToday(event.eventDate)}</p>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title fw-semibold">{event.title}</h5>
                                    <div className="position-relative overflow-hidden" style={{ height: "150px", textAlign: 'justify' }}>
                                        <p className="card-text"></p>
                                        <div className="position-absolute top-0 left-0 w-100 h-100 bg-gradient-trans"></div>
                                    </div>
                                    <Link to={`/event/${event._id}`} className="btn btn-danger px-4 rounded-0">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Event
