import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE from "../API";
import { toast } from "react-toastify";
import { formatDateOrToday } from "../utils/dateFormatter";
import ReviewDisplayModal from "../Components/ReviewDisplayModal";

function Assignments({ articleAssignments, userAssignments, refresh }) {

  const [groupBy, setGroupBy] = useState('article');

  useEffect(() => {
    console.log(userAssignments);
    console.log(articleAssignments);
  }, [])

  return (
    <>
      <div className="container flex-acenter gap-2 mt-3">
        <h3 className="fw-semibold fs-5 mb-0">Group By :</h3>
        <ul class="nav nav-underline mb-0">
          <li class="nav-item">
            <button
              type="button"
              className={`nav-link ${groupBy === 'article' ? 'active' : ''}`}
              onClick={() => { setGroupBy('article') }}
            >Article</button>        </li>
          <li class="nav-item">
            <button
              type="button"
              className={`nav-link ${groupBy === 'user' ? 'active' : ''}`}
              onClick={() => { setGroupBy('user') }}
            >User</button>
          </li>
        </ul>
      </div>
      <hr />
      {groupBy === 'article' && articleAssignments.length !== 0 && (
        <>
          <div className="row gap-3">
            {articleAssignments.map((article) => (
              <>
                <div className="col-md-4 p-3 shadow rounded-2" style={{ maxWidth: '26rem' }} key={article._id}>
                  <h1 className="fs-4 fw-semibold text-indigo">{article.articleTitle}</h1>
                  <p className="text-muted fs-small">Published On: {formatDateOrToday(article.createdAt)}</p>
                  <hr />
                  <p className="fs-4">Assigned Reviewers:</p>
                  {article.assignedUsers.map((user) => (
                    <div key={user._id}>
                      <div className="flex-jbetween flex-acenter mb-1">
                        <div>
                          <h3 className="fs-small mb-1">{user.username}</h3>
                          <h3 className="fs-small mb-1 text-muted">({user.email})</h3>
                        </div>
                        {
                          user.hasReviewed ? (
                            <span class="badge text-bg-success mb-1">Reviewed</span>
                          ) : (
                            <span class="badge text-bg-danger mb-1">Pending</span>
                          )
                        }
                      </div>

                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        </>
      )}
      {groupBy === 'user' && (
        <>
          <div className="row gap-3">
            {userAssignments.map((user) => (
              <>
                <div className="col-md-4 p-3 shadow rounded-2 overflow-hidden" style={{ maxWidth: '26rem', maxHeight: '240px' }} key={user._id}>
                  <h1 className="fs-4 fw-semibold text-indigo">{user.username}</h1>
                  <p className="text-muted fs-small">ID: {user.userId}</p>
                  <hr />
                  <p className="fs-4">Assigned Articles:</p>
                  {user.assignedArticles.map((article) => (
                    <div className="flex-jbetween flex-acenter mb-1" key={article._id}>
                      <h3 className="fs-small mb-1">{article.title}</h3>
                      {
                        article.hasReviewed ? (
                          <span class="badge text-bg-success mb-1">Reviewed</span>
                        ) : (
                          <span class="badge text-bg-danger mb-1">Pending</span>
                        )
                      }
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </>
  )
}

function AllReviews({ allReviews, refresh }) {
  const [showReviewsModal, setShowReviewsModal] = useState(false); // State to control modal visibility
  const [reviewArticle, setReviewArticle] = useState({});


  const handleOpenReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);
  };
  return (
    <>
      <div className="row gap-3 mt-3">
        {allReviews.map((review) => (
          <div className="col-md-4 shadow p-3 rounded-2" key={review._id} style={{ maxWidth: '24rem' }}>
            <h2 className="text-indigo fs-4">{review.articleId.title}</h2>
            <p className="text-muted fs-small"> {formatDateOrToday(review.createdAt)}</p>
            <hr />
            <div className="flex-acenter gap-1 mb-2">
              <h2 className="fw-semibold fs-5 mb-0">Author : </h2>
              <p className="fs-5 mb-0">
                {review.articleId.author.authorName}
              </p>
            </div>
            <div className="flex-acenter gap-1 mb-2">
              <h2 className="fw-semibold fs-5 mb-0">Reviewd By : </h2>
              <p className="fs-5 mb-0">{review.userId.username}</p>
            </div>
            <div className="flex-center mt-4">
              <button
                type="button"
                onClick={(e) => {
                  handleOpenReviewsModal();
                  setReviewArticle(review.articleId);
                }}
                className="btn btn-danger rounded-0 px-4 flex-acenter gap-2"
              >
                <i className="bi bi-eye"></i>
                Show Review
              </button>
            </div>
          </div>
        ))}
      </div >
      {/* Render ReviewDisplayModal if showReviewsModal is true */}
      {
        showReviewsModal && reviewArticle && (
          <ReviewDisplayModal
            article={reviewArticle}
            close={handleCloseReviewsModal}
          />
        )
      }
    </>
  )
}

function Reviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]);
  const [articleAssignments, setArticleAssignments] = useState([]);
  const [tab, setTab] = useState('all');

  function getAllReviews() {
    setAllReviews([]);

    axios
      .get(`${API_BASE}/review`)
      .then((response) => {
        setAllReviews(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Sorry! no reviews found");
      });
  }

  function getAllAssignments() {
    setUserAssignments([]);
    setArticleAssignments([]);

    axios
      .get(`${API_BASE}/assignReview`)
      .then((response) => {
        setUserAssignments(response.data.byUser);
        setArticleAssignments(response.data.byArticle);
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Sorry! no reviews found");
      });
  }

  useEffect(() => {
    getAllReviews();
    getAllAssignments();
  }, []);

  return (
    <div className="admin-content px-2">
      <div className="container-fluid p-3 mt-5">
        <h3 className="text-center fw-semibold fs-3">Manage Reviews</h3>
        <hr />
        {allReviews.length === 0 ? (
          <h2 className="text-center fst-italic fw-normal fs-2">
            No reviews found!
          </h2>
        ) : (
          <>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  onClick={() => { setTab('all') }}
                  type='button'
                  className={`nav-link text-black  ${tab === 'all' ? 'active' : ''}`}
                  aria-current="page"
                >Reviews</button>
              </li>
              <li className="nav-item">
                <button
                  type='button'
                  onClick={(e) => { setTab('assignment') }}
                  className={`nav-link text-black  ${tab === 'assignment' ? 'active' : ''}`}
                >Assignments</button>
              </li>
            </ul>

            {tab === 'all' ? <AllReviews allReviews={allReviews} refresh={getAllReviews} /> : <Assignments articleAssignments={articleAssignments} userAssignments={userAssignments} refresh={getAllAssignments} />}
          </>
        )}
      </div>

    </div>
  );
}

export default Reviews;
