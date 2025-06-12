import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../API';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination, Navigation } from 'swiper/modules';

function Island({ logged }) {
    const [articles, setArticles] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const { islandId } = useParams();
    const [subscription, setSubscription] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    function getAllArticles() {
        axios
            .get(`${API_BASE}/article/island/${islandId}`)
            .then((response) => {
                setAllArticles(response.data);
                setArticles(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    function checkAccess() {
        const user = localStorage.getItem('faro-user');
        if (user)
            axios
                .get(`${API_BASE}/island/checkAccess/${islandId}`, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    if (response.status == 200) {
                        setSubscription(true);
                    }
                })
                .catch((error) => {
                    setSubscription(false);
                });
    }

    function showResults() {
        if (searchKey.trim() === '') {
            setSearch(false);
            setArticles(allArticles);
        } else {
            setSearch(true);
            setArticles(searchResults);
        }
    }

    useEffect(() => {
        if (searchKey.trim() === '') {
            setSearch(false);
            setSearchResults([]);
            setArticles(allArticles);
        } else {
            const searchLower = searchKey.toLocaleLowerCase();

            const matched = allArticles.filter(article =>
                article.title.toLowerCase().includes(searchLower) ||
                article.author.authorName.toLowerCase().includes(searchLower)
            );

            setSearchResults(matched);
        }
    }, [searchKey])

    useEffect(() => {
        getAllArticles();
        checkAccess();
    }, [])
    return (
        <div className='container-fluid px-4 mt-4'>
            <div className="container-fluid flex-jbetween flex-acenter">
                {search ?
                    <h2 className="text-center fw-semibold mt-3">Search Results</h2>
                    :
                    <h2 className="text-center fw-semibold mt-3">Articles of Island</h2>
                }
                <div className="d-flex flex-md-row flex-sm-column gap-2" style={{ width: "fit-content" }}>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        name='search'
                        id='search'
                        value={searchKey}
                        onChange={(e) => { setSearchKey(e.target.value) }}
                        placeholder='Search Article'
                    />
                    <button
                        type='button'
                        onClick={showResults}
                        className="btn btn-primary px-3 rounded-0"
                    >Search</button>
                </div>

            </div>
            <hr />

            <div className='container-fluid p-4'>
                <div className="row flex-jcenter gap-2">

                    <div className="col-md-5">
                        <h2 className="text-center fw-semibold fs-3">Free Tier Articles</h2>
                        {articles.length == 0 ? '' : (
                            <div className="list-group">
                                {articles.map((article) => (
                                    article.tier === 'free' && article.approval === true && (
                                        <Link to={`/article/${article._id}`} key={article._id} className='list-group-item flex-jbetween text-primary'>
                                            {article.title}
                                            <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-md-5">
                        <h2 className="text-center fw-semibold fs-3">Subscriber Exclusive</h2>
                        {articles.length == 0 ? '' : (
                            <div className="list-group">
                                {articles.map((article) => (
                                    article.tier != 'free' && article.approval === true && (
                                        <Link to={`/article/${article._id}`} key={article._id} className={`list-group-item flex-jbetween text-primary ${subscription ? '' : 'disabled'}`}>
                                            {article.title}
                                            {subscription ?
                                                <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                                :
                                                <ion-icon name="lock-closed-outline" className="fs-5"></ion-icon>
                                            }
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    {islandId === '6800f6cdf56f8fccd8566741' && (
                        <div className="container-fluid px-lg-5 px-3 mt-5" id='services'>
                            <div className="row flex-center">
                                <div className="col-md-5">
                                    <h2 className="text-center fw-bold mb-3 ">
                                        What You'll Find on
                                        <p className='d-inline mb-0'> F</p>
                                        <p className='text-danger d-inline mb-0'>A</p>
                                        <p className='d-inline mb-0'>R</p>
                                        <p className='text-danger d-inline mb-0'>O</p>
                                    </h2>
                                    <p className="text-center text-muted mb-3">Explore the Blueprint of Modern Knowledge.</p>
                                    <p className='fs-18'>FARO is your gateway to structured, reliable, and expertly curated content — from architectural blueprints and engineering methodologies to practical code snippets and reference diagrams. Whether you're a student, professional, or curious learner, FARO helps you navigate complex topics with clarity, depth, and precision.</p>
                                    <div className='d-flex'>
                                        <Link to={'/island/6800f6cdf56f8fccd8566741/samples'} className='btn btn-danger flex-acenter px-4 rounded-0 gap-2'>
                                            <ion-icon name="eye-outline"></ion-icon>
                                            View Samples
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-7 irregular-shape">
                                    <Swiper
                                        spaceBetween={30}
                                        loop={true}
                                        centeredSlides={true}
                                        autoplay={{
                                            delay: 4000,
                                            disableOnInteraction: false,
                                        }}
                                        modules={[Autoplay]}
                                        className="mySwiper"
                                    >
                                        <SwiperSlide>
                                            <div className="position-relative">
                                                <img src="/assets/img/service.png" alt="" className="img-fluid" width={960} height={720} />
                                                <div className="position-absolute top-0 pt-4 left-0 w-100 h-100 bg-gradient-trans-black d-flex align-items-end justify-content-center">
                                                    <h1 className="text-white mt-5 fw-bold">Reference Diagrams</h1>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="position-relative">
                                                <img src="/assets/img/service-2.jpg" alt="" className="img-fluid" width={960} height={720} />
                                                <div className="position-absolute top-0 pt-4 left-0 w-100 h-100 bg-gradient-trans-black d-flex align-items-end justify-content-center">
                                                    <h1 className="text-white mt-5 fw-bold">Architectural Diagrams</h1>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="position-relative">
                                                <img src="/assets/img/service-3.jpg" alt="" className="img-fluid" width={960} height={720} />
                                                <div className="position-absolute top-0 pt-4 left-0 w-100 h-100 bg-gradient-trans-black d-flex align-items-end justify-content-center">
                                                    <h1 className="text-white mt-5 fw-bold">Code Snippets</h1>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Island
