import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../API';
import { Link } from 'react-router-dom';
import { formatDateOrToday } from '../utils/dateFormatter';
import { toast } from 'react-toastify';

function RemoveModal({ title, id, close, refresh }) {

    function handleRemove() {
        axios
            .delete(`${API_BASE}/event/delete/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status == 200)
                    toast.success("Event removed successfully!");
                refresh();
                close();
            })
            .catch((err) => {
                console.log(err.response.data);
                toast.error("Sorry! some error occured while deleting");
                close();
            })
    }

    return (
        <>
            <div className="my-modal">
                <div className="col-4 bg-white p-4">
                    <div className="flex-jbetween">
                        <div>
                            <h1 className="flex-acenter fs-3">
                                <ion-icon name="warning-outline" className="text-danger"></ion-icon>
                                Removing an event
                            </h1>
                        </div>
                        <ion-icon
                            name="close-outline"
                            className="text-black-50 fs-2 cursor-pointer"
                            onClick={() => { close(); }}
                        ></ion-icon>
                    </div>
                    <hr />

                    <h5 className="fs-5 text-danger flex-acenter">
                        Warning: The event has been published. Removing can cause confusion to viewers.
                    </h5>
                    <p className='fs-18 mb-0'>
                        Title : {title}
                    </p>
                    <hr />
                    <div className="flex-jend">
                        <button
                            type="button"
                            className="btn btn-dark px-4 rounded-0 me-2"
                            onClick={close}
                        >Cancel</button>
                        <button type='button' onClick={handleRemove} className="btn btn-danger px-4 rounded-0">Remove</button>
                    </div>
                </div>
            </div>
        </>
    )
}

function Events() {
    const [events, setEvents] = useState([]);
    const [removeModal, setRemoveModal] = useState(false);

    const handleRemoveModal = () => {
        setRemoveModal(false);
        setRemovingData({
            id: null,
            title: null
        });
    }

    const [removingData, setRemovingData] = useState({
        id: null,
        title: null
    });

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
                                                    <li>
                                                        <button
                                                            className="dropdown-item bg-danger text-white rounded-0 flex-acenter gap-2"
                                                            onClick={() => {
                                                                setRemovingData({
                                                                    id: event._id,
                                                                    title: event.title
                                                                });
                                                                setRemoveModal(true);
                                                            }} >
                                                            <ion-icon name="trash-outline"></ion-icon>
                                                            Remove Event
                                                        </button>
                                                    </li>
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

            {removeModal && <RemoveModal title={removingData.title} id={removingData.id} close={handleRemoveModal} refresh={getEventList} />}

        </>
    )
}

export default Events
