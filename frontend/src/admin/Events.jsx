import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function AddEvent({ refresh, close }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [desc, setDesc] = useState('');

    function handleAddEvent(e) {
        e.preventDefault();

        axios
            .post(`${API_BASE}/event/create`, {
                title,
                location,
                eventDate,
                desc
            }, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    toast.success("Success! Event is added.");
                    refresh();
                    close();
                }
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Sorry! An error occured while adding the event.")
            })
    }
    return (
        <>
            <div className="my-modal">
                <div className="col-4 bg-white p-4">
                    <div className="flex-jbetween">
                        <h1 className="text-center fs-3"> Add new Event</h1>
                        <ion-icon
                            name="close-outline"
                            className="text-black-50 fs-2 cursor-pointer"
                            onClick={() => { close(); }}
                        ></ion-icon>
                    </div>
                    <hr />
                    <form onSubmit={handleAddEvent}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Event Name</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                onChange={(e) => { setTitle(e.target.value); }}
                                className="form-control rounded-0"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="eventDate" className="form-label">Event Date</label>
                            <input
                                type="date"
                                name="eventDate"
                                id="eventDate"
                                onChange={(e) => { setEventDate(e.target.value); }}
                                className="form-control rounded-0"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <textarea
                                type="text"
                                name="desc"
                                id="desc"
                                onChange={(e) => { setDesc(e.target.value); }}
                                rows={3}
                                className="form-control rounded-0"
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <textarea
                                type="text"
                                name="location"
                                id="location"
                                onChange={(e) => { setLocation(e.target.value) }}
                                rows={3}
                                className="form-control rounded-0"
                            ></textarea>
                        </div>
                        <div className="flex-jend gap-2">
                            <button type='button' onClick={() => { close(); }} className="btn btn-dark px-4 rounded-0">Cancel</button>
                            <button type='submit' className="btn btn-danger px-4 rounded-0" >Add Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

function Events() {
    const [eventModal, setEventModal] = useState(false);
    const [events, setEvents] = useState([]);

    const handleEventModal = () => setEventModal(false);

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

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
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
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2" onClick={() => { setEventModal(true) }}>
                                <i className="bi bi-calendar-plus"></i>
                                Schedule an Event
                            </button>
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
                                        <td>{formatDate(event.eventDate)}</td>
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

            {!eventModal ? '' : <AddEvent refresh={getEventList} close={handleEventModal} />}

        </>
    )
}

export default Events
