import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import IslandCanvas from '../Components/IslandCanvas';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Pagination, Navigation } from 'swiper/modules';
import API_BASE from '../API';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Home() {
    const location = useLocation();
    const [islands, setIslands] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [slides, setSlides] = useState(1);

    const [events, setEvents] = useState([]);

    function getIslands() {
        axios
            .get(`${API_BASE}/island/`)
            .then((response) => {
                setIslands(response.data);
                // console.log(response.data);

            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    function getUpcomingEvents() {
        setEvents([]);
        axios
            .get(`${API_BASE}/event/upcoming`)
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
    };

    function formatDateOrToday(isoDate) {
        const inputDate = new Date(isoDate);
        const today = new Date();

        // Reset time for both dates to compare only the date part
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate.getTime() === today.getTime()) {
            return "Today";
        }

        const day = String(inputDate.getDate()).padStart(2, '0');
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const year = inputDate.getFullYear();

        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        AOS.init();

        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        getIslands();
        getUpcomingEvents();

        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location]);

    useEffect(() => {
        if (screenWidth < 1024) {
            setSlides(1);
        } else {
            setSlides(2);
        }
    }, [screenWidth]);
    return (
        <>
            <div className="container-fluid bg-hero g-0">
                <div className="container-fluid bg-mask p-3" style={{ "minHeight": "100vh" }}>
                    <div className="row flex-center">
                        <div className="col-md-8 px-4">
                            <div className="flex-jcenter flex-column p-4 w-fit">
                                <h1 className='fw-semibold fs-large text-white' data-aos="fade-right" data-aos-duration="800">Hello,</h1>
                                <h1 className='fw-semibold fs-large text-white' data-aos="fade-right" data-aos-duration="800" data-aos-delay="500">WE ARE</h1>
                                <h1 className='fw-normal fs-large text-secondary' data-aos="fade-right" data-aos-duration="800" data-aos-delay="800">FARO</h1>
                            </div>
                            <p className='text-white-50 fw-semibold fs-4' data-aos="fade-up" data-aos-duration="800" data-aos-delay="1300">At FARO, we excel in knowledge services. We provide authentic professional content for multiple domains in multiple languages and media. We bring the knowledge workers across the world to a common forum enriching content and consumers collaboratively.</p>
                        </div>
                        <div className="col-md-4 flex-center flex-column gap-2">
                            {events.length === 0 ? '' : (
                                <div className="container bg-blur p-4">
                                    <div className="flex-jbetween flex-acenter">
                                        <h1 className="text-white">Events</h1>
                                        <Link to={''} className='text-white flex-acenter gap-2 text-decoration-none'>
                                            See all
                                            <ion-icon name="arrow-forward-outline" className="text-white"></ion-icon>
                                        </Link>
                                    </div>
                                    <hr className='border border-white' />

                                    {events.map((event) => (
                                        <div className="container overflow-y-scroll" style={{ maxHeight: "350px" }} key={event._id}>
                                            <div className="card text-bg-secondary mb-3">
                                                <div className="card-header">{formatDateOrToday(event.createdAt)}</div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{event.title}</h5>
                                                    <Link to={`/event/${event._id}`} className="btn btn-dark px-4 rounded-0">See Details</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-light">
                <div className="container py-5">
                    <h1 className="text-center fw-bold fs-2">Why FARO?</h1>
                    <p className="text-center text-muted mb-5">Everything you need to learn, share, and grow in one platform.</p>
                    <div className="flex-jcenter gap-5 flex-column flex-md-row">
                        <div className="card py-4 hover-shadow-colored col-md-4">
                            <div className="card-body">
                                <h5 className="card-title flex-center gap-2">🔍 Discover</h5>
                                <p className="card-text text-center"> Browse high-quality articles across tech, science, and more — curated for real learning.</p>
                                <div className="flex-center">
                                    <Link to={'/islands'} className='btn btn-danger mt-3 px-4 rounded-0'>Discover Now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card py-4 hover-shadow-colored col-md-4">
                            <div className="card-body">
                                <h5 className="card-title flex-center gap-2">✍️ Contribute</h5>
                                <p className="card-text text-center">Write and share your knowledge. FARO empowers experts and learners alike.</p>
                                <div className="flex-center">
                                    <Link to={'/login'} className='btn btn-danger mt-3 px-4 rounded-0'>Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid g-0 bg-light p-3" id='islands'>
                <h1 className="text-center">Islands of Knowledge</h1>
            </div>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                speed={600}
                parallax={true}
                slidesPerView={slides}
                spaceBetween={0}
                centeredSlides={false}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Parallax, Pagination, Navigation]}
                className="mySwiper"
            >
                <div
                    slot="container-start"
                    className="parallax-bg"
                    style={{
                        'backgroundImage':
                            'url(/assets/img/bg-sea3.jpg)',
                    }}
                    data-swiper-parallax="-23%"
                ></div>
                {islands.slice(0, 5).map((island) => (
                    <SwiperSlide>
                        <div className='' key={island._id}>
                            <IslandCanvas title={island.title} slides={slides} />
                            <div className="flex-center">
                                <Link to={`/island/${island._id}`} className='btn btn-dark px-5 rounded-0'>Visit Island</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper >

            <div className="container-fluid py-5 px-3 bg-white" id="services">
                <h2 className="text-center fw-bold mb-3">What You'll Find on FARO</h2>
                <p className="text-center text-muted mb-5">More than just articles — FARO offers real-world resources to build, learn, and contribute.</p>
                <div className="row flex-jcenter gap-3">
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-bar-chart-fill text-warning"></i>
                            Reference Diagrams
                        </h2>
                        <p className="text-center">Visual guides to understand key system flows</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-buildings"></i>
                            Architecture Templates
                        </h2>
                        <p className="text-center">Sample structures to start your system design</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-diagram-3 text-danger"></i>
                            Architectural Diagrams
                        </h2>
                        <p className="text-center">System layouts & deployment visuals</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-clipboard-fill text-primary"></i>
                            Cheatsheets
                        </h2>
                        <p className="text-center">Fast access to key concepts in tech & methodology</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-file-earmark-code-fill text-success"></i>
                            Code Snippets
                        </h2>
                        <p className="text-center">Ready-to-use code blocks across languages</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-file-earmark-pdf-fill text-primary"></i>
                            Design Docs & Templates
                        </h2>
                        <p className="text-center">Real templates for technical design and planning</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">🎯 Expert Tips </h2>
                        <p className="text-center">Advice from experienced devs & architects</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 bg-light px-4 py-5">
                        <h2 className="fs-3 flex-center gap-2 fw-semibold">
                            <i className="bi bi-gear-fill text-success"></i>
                            Professional Tools Intro
                        </h2>
                        <p className="text-center">Hands-on intros to tools like Figma, Postman, Terraform, etc.</p>
                        <div className="flex-center">
                            <button className="btn btn-danger px-4 rounded-0 flex-acenter gap-2 fs-6">
                                <i className="bi bi-cloud-download-fill"></i>
                                Download Sample
                            </button>
                        </div>
                    </div>
                </div>
            </div >


            {/* <div className="bg-light pb-4" id="choose">
                <h1 className='text-center fs-large p-3'>CHOOSE <b className='text-secondary fw-normal'>US</b></h1>
                <div className="container">
                    <div className="flex-acenter flex-md-row flex-column bg-gradient-dark overflow-hidden">
                        <div className="col-md-6 p-5 text-white">
                            <h1 className='fw-semibold'>Expertise Across Domains</h1>
                            <p>Our domain experts carefully hand craft or curate the contents for effective consumption. </p>
                        </div>
                        <div className="col-md-6 hover-zoom">
                            <img src="/assets/img/meeting.jpg" alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="flex-acenter flex-md-row flex-column-reverse bg-gradient-dark overflow-hidden">
                        <div className="col-md-6 hover-zoom">
                            <img src="/assets/img/colab.jpg" alt="" className="img-fluid" />
                        </div>
                        <div className="col-md-6 p-5 text-white">
                            <h1 className='fw-semibold'>Collaborative Approach</h1>
                            <p>Collaboration brings out best of the summary and themes for industrial consumption.</p>
                        </div>
                    </div>
                    <div className="flex-acenter flex-md-row flex-column bg-gradient-dark overflow-hidden">
                        <div className="col-md-6 p-5 text-white">
                            <h1 className='fw-semibold'>Future-Proof Solutions</h1>
                            <p> We focus on designing architectures that are adaptable, helping you stay ahead of evolving technology trends and business needs. </p>
                        </div>
                        <div className="col-md-6 hover-zoom">
                            <img src="/assets/img/futuretech.jpg" alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Home
