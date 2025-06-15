import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../API';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

function Island({ logged }) {
    const [articlesFree, setArticlesFree] = useState([]);
    const [articlesPremium, setArticlesPremium] = useState([]);

    const [freeArticles, setFreeArticles] = useState([]);
    const [premiumArticles, setPremiumArticles] = useState([]);

    const { islandId } = useParams();
    const [subscription, setSubscription] = useState(false);

    const [search, setSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [articlePerPage, setArticlePerPage] = useState(15);
    const [freeArticlePage, setFreeArticlePage] = useState(1);
    const [premiumArticlePage, setPremiumArticlePage] = useState(1);

    const [totalFreePages, setTotalFreePages] = useState(1);
    const [totalPremiumPages, setTotalPremiumPages] = useState(1);

    function getAllArticles() {
        axios
            .get(`${API_BASE}/article/island/${islandId}`)
            .then((response) => {
                setFreeArticles(response.data.freeArticles);

                const indexOfLastArticle = freeArticlePage * articlePerPage;
                const indexOfFirstArticle = indexOfLastArticle - articlePerPage;
                setArticlesFree(response.data.freeArticles.slice(indexOfFirstArticle, indexOfLastArticle));

                setPremiumArticles(response.data.paidArticles);
                setArticlesPremium(response.data.paidArticles.slice(indexOfFirstArticle, indexOfLastArticle));

                setTotalFreePages(Math.ceil(response.data.freeArticles.length / articlePerPage));
                setTotalPremiumPages(Math.ceil(response.data.paidArticles.length / articlePerPage));
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
        } else {
            setSearch(true);
        }
    }

    useEffect(() => {
        if (searchKey.trim() === '') {
            setSearch(false);
            setSearchResults([]);
        } else {
            const searchLower = searchKey.toLocaleLowerCase();

            const matched_1 = freeArticles.filter(article =>
                article.title.toLowerCase().includes(searchLower) ||
                article.author.authorName.toLowerCase().includes(searchLower)
            );

            const matched_2 = premiumArticles.filter(article =>
                article.title.toLowerCase().includes(searchLower) ||
                article.author.authorName.toLowerCase().includes(searchLower)
            );

            const final_results = [];
            matched_1.forEach(matched => {
                final_results.push(matched);
            })
            matched_2.forEach(matched => {
                final_results.push(matched);
            })
            setSearchResults(final_results);

        }
    }, [searchKey])

    useEffect(() => {
        const indexOfLastArticle = freeArticlePage * articlePerPage;
        const indexOfFirstArticle = indexOfLastArticle - articlePerPage;
        setArticlesFree(freeArticles.slice(indexOfFirstArticle, indexOfLastArticle));
    }, [freeArticlePage]);

    useEffect(() => {
        const indexOfLastArticle = premiumArticlePage * articlePerPage;
        const indexOfFirstArticle = indexOfLastArticle - articlePerPage;
        setArticlesPremium(premiumArticles.slice(indexOfFirstArticle, indexOfLastArticle));
    }, [premiumArticlePage]);

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

                    {/* rendering the free articles with pagination  */}
                    {!search && (
                        <div className="col-md-5">
                            <h2 className="text-center fw-semibold fs-3">Free Tier Articles</h2>
                            {articlesFree.length !== 0 && (
                                <div className="list-group">
                                    {articlesFree.map((article) => (
                                        article.approval === true && (
                                            <Link to={`/article/${article._id}`} key={article._id} className='list-group-item flex-jbetween text-primary'>
                                                {article.title}
                                                <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            )}
                            <div className="flex-jend mt-4">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {freeArticlePage !== 1 && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    aria-label="Previous"
                                                    onClick={() => {
                                                        setFreeArticlePage(freeArticlePage - 1);
                                                    }}
                                                >
                                                    <span aria-hidden="true">&laquo;</span>
                                                </button>
                                            </li>
                                        )}
                                        {freeArticlePage - 1 > 0 && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    onClick={() => {
                                                        setFreeArticlePage(freeArticlePage - 1);
                                                    }}
                                                >{freeArticlePage - 1}</button>
                                            </li>
                                        )}
                                        <li className="page-item active">
                                            <button className="page-link">{freeArticlePage}</button>
                                        </li>
                                        {freeArticlePage + 1 <= totalFreePages && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    onClick={() => {
                                                        setFreeArticlePage(freeArticlePage + 1);
                                                    }}
                                                >{freeArticlePage + 1}</button>
                                            </li>
                                        )}
                                        {totalFreePages !== freeArticlePage && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    aria-label="Next"
                                                    onClick={() => {
                                                        setFreeArticlePage(freeArticlePage + 1);
                                                    }}
                                                >
                                                    <span aria-hidden="true">&raquo;</span>
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* rendering the premium / paid articles with pagination  */}
                    {!search && (
                        <div className="col-md-5">
                            <h2 className="text-center fw-semibold fs-3">Subscriber Exclusive</h2>
                            {articlesPremium.length !== 0 && (
                                <div className="list-group">
                                    {articlesPremium.map((article) => (
                                        <Link to={`/article/${article._id}`} key={article._id} className={`list-group-item flex-jbetween text-primary ${subscription ? '' : 'disabled'}`}>
                                            {article.title}
                                            {subscription ?
                                                <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                                :
                                                <ion-icon name="lock-closed-outline" className="fs-5"></ion-icon>
                                            }
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <div className="flex-jend mt-4">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {premiumArticlePage !== 1 && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    aria-label="Previous"
                                                    onClick={() => {
                                                        setPremiumArticlePage(premiumArticlePage - 1);
                                                    }}
                                                >
                                                    <span aria-hidden="true">&laquo;</span>
                                                </button>
                                            </li>
                                        )}
                                        {premiumArticlePage - 1 > 0 && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    onClick={() => {
                                                        setPremiumArticlePage(premiumArticlePage - 1);
                                                    }}
                                                >{premiumArticlePage - 1}</button>
                                            </li>
                                        )}
                                        <li className="page-item active">
                                            <button className="page-link">{premiumArticlePage}</button>
                                        </li>
                                        {premiumArticlePage + 1 <= totalPremiumPages && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    onClick={() => {
                                                        setPremiumArticlePage(premiumArticlePage + 1);
                                                    }}
                                                >{premiumArticlePage + 1}</button>
                                            </li>
                                        )}
                                        {totalPremiumPages !== premiumArticlePage && (
                                            <li className="page-item">
                                                <button
                                                    type='button'
                                                    className="page-link"
                                                    aria-label="Next"
                                                    onClick={() => {
                                                        setPremiumArticlePage(premiumArticlePage + 1);
                                                    }}
                                                >
                                                    <span aria-hidden="true">&raquo;</span>
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* rendering search results  */}
                    {search && (
                        <div className="col-md-5">
                            {searchResults.length !== 0 ? (
                                <>
                                    <h2 className="text-center fw-semibold fs-3">Search Results Articles</h2>
                                    <div className="list-group">
                                        {searchResults.map((article) => (
                                            <Link to={`/article/${article._id}`} key={article._id} className='list-group-item flex-jbetween text-primary'>
                                                {article.title}
                                                {article.tier === 'free' || subscription ?
                                                    <ion-icon name="lock-open-outline" className="fs-5 "></ion-icon>
                                                    :
                                                    <ion-icon name="lock-closed-outline" className="fs-5 "></ion-icon>
                                                }
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="flex-jend mt-4">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                {freeArticlePage !== 1 && (
                                                    <li className="page-item">
                                                        <button
                                                            className="page-link"
                                                            aria-label="Previous"
                                                            onClick={() => {
                                                                setFreeArticlePage(freeArticlePage - 1);
                                                            }}
                                                        >
                                                            <span aria-hidden="true">&laquo;</span>
                                                        </button>
                                                    </li>
                                                )}
                                                {freeArticlePage - 1 > 0 && (
                                                    <li className="page-item">
                                                        <button
                                                            type='button'
                                                            className="page-link"
                                                            onClick={() => {
                                                                setFreeArticlePage(freeArticlePage - 1);
                                                            }}
                                                        >{freeArticlePage - 1}</button>
                                                    </li>
                                                )}
                                                <li className="page-item active">
                                                    <button className="page-link">{freeArticlePage}</button>
                                                </li>
                                                {freeArticlePage + 1 <= totalFreePages && (
                                                    <li className="page-item">
                                                        <button
                                                            type='button'
                                                            className="page-link"
                                                            onClick={() => {
                                                                setFreeArticlePage(freeArticlePage + 1);
                                                            }}
                                                        >{freeArticlePage + 1}</button>
                                                    </li>
                                                )}
                                                {totalFreePages !== freeArticlePage && (
                                                    <li className="page-item">
                                                        <button
                                                            type='button'
                                                            className="page-link"
                                                            aria-label="Next"
                                                            onClick={() => {
                                                                setFreeArticlePage(freeArticlePage + 1);
                                                            }}
                                                        >
                                                            <span aria-hidden="true">&raquo;</span>
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    </div>
                                </>
                            ) : (
                                <div className='flex-acenter flex-jcenter gap-2'>
                                    <h2 className="fs-4 fw-semibold fst-italic">Sorry! No articles found</h2>
                                    <button
                                        type='button'
                                        className="btn btn-dark rounded-0 px-3"
                                        onClick={() => {
                                            setSearch(false);
                                            setSearchKey('');
                                            setSearchResults([]);
                                        }}
                                    >Back</button>

                                </div>
                            )}

                        </div>
                    )}

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
