import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import API_BASE from '../API';
import { formatDateOrToday } from '../utils/dateFormatter';
import { toast } from 'react-toastify';
import { useLoading } from '../Context/LoadingContext';

function EventDetails() {
    const [eventData, setEventData] = useState();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');

    const { eventId } = useParams();
    const { showLoading, hideLoading } = useLoading();

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

    function handleRegistration(e) {
        e.preventDefault();
        showLoading();
        axios
            .post(`${API_BASE}/eventRegistry/create`, {
                fullname,
                email,
                eventId
            })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Registration successfull check your email for invite to event");
                }
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status === 400)
                    toast.error("Sorry! Email is alredy registered");
                else
                    toast.error("Sorry! some error happened while registering");
            });
        setEmail('');
        setFullname('');
        hideLoading();
    }

    useEffect(() => {
        getEventData();
    }, [])

    if (!eventData)
        return ''

    return (
        <div className="container-fluid px-3 py-3 mt-lg-4 mt-2">
            <div className="row flex-jcenter">
                <h1 className="text-center fw-semibold fs-3">{eventData.title}</h1>
                <hr />
                <div className='col-md-8'>
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
                <div className="vr d-md-block d-none g-0 border border-black"></div>
                <hr className="d-md-none d-block" />
                <div className="col-md-3 flex-jcenter h-100">
                    <div className="container-fluid p-3 bg-light rounded-2">
                        <h2 className="text-center fw-semibold fs-4">Register for Event </h2>
                        <hr />
                        <form onSubmit={handleRegistration}>

                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name='fullname'
                                    id='fullname'
                                    placeholder='Username'
                                    value={fullname}
                                    className="form-control rounded-0"
                                    onChange={(e) => { setFullname(e.target.value) }}
                                />
                                <label htmlFor="fullname">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    name='email'
                                    id='email'
                                    value={email}
                                    placeholder='Email'
                                    className="form-control rounded-0"
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="flex-center mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-danger rounded-0 px-3"
                                >Register Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventDetails
