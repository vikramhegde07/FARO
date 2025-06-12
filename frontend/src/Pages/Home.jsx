import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import API_BASE from '../API';
import { formatDateOrToday } from '../utils/dateFormatter';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Home({ logged }) {
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
        if (screenWidth < 540) {
            setSlides(1)
        } else if (screenWidth < 768) {
            setSlides(1);
        } else {
            setSlides(3);
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
                                        <Link to={'/events'} className='text-white flex-acenter gap-2 text-decoration-none'>
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

            <div className="container-fluid">
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
                                    <Link to={`${logged ? '/account' : '/login'}`} className='btn btn-danger mt-3 px-4 rounded-0'>Get Started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid g-0 bg-light p-3" id='islands'>
                <h1 className="text-center">Islands of Knowledge</h1>
                <hr />
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
                className="mySwiper bg-light"
            >
                <div slot="container-start" data-swiper-parallax="-23%"></div>
                {islands.slice(0, 5).map((island) => (
                    <SwiperSlide>
                        <div className='py-5 position-relative' key={island._id}>
                            <Link to={`/island/${island._id}`} className="bg-island">
                                <h3>{island.title}</h3>
                            </Link>
                            <div className="island-slider"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper >
        </>
    )
}

export default Home
