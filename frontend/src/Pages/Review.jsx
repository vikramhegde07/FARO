import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE from "../API";
import { useLoading } from "../Context/LoadingContext";
import { formatDateOrToday } from "../utils/dateFormatter";
import { toast } from "react-toastify";
import ReviewDisplayModal from "../Components/ReviewDisplayModal";
import ReviewMode from "../Components/ReviewMode";

function Review() {
  const [reviews, setReviwes] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const { showLoading, hideLoading } = useLoading();
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewArticle, setReviewArticle] = useState({});

  const [showReviewsModal, setShowReviewsModal] = useState(false); // State to control modal visibility

  const handleOpenReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);
  };

  const hideReviewMode = () => {
    setReviewArticle({});
    setReviewMode(false);
  };

  function getAssignments() {
    showLoading();
    setReviwes([]);
    axios
      .get(`${API_BASE}/assignReview/user-assignments`, {
        headers: {
          Authorization: localStorage.getItem("faro-user"),
        },
      })
      .then((response) => {
        setReviwes(response.data);
        let count = 0;
        response.data.forEach((review) => {
          if (review.hasBeenReviewed === false) count = count + 1;
        });
        setNewCount(count);
      })
      .catch((error) => {
        console.log(error.response);
      });
    hideLoading();
  }

  useEffect(() => {
    getAssignments();
  }, []);

  return (
    <div className="container-fluid px-4 py-3 mt-lg-4 mt-2">
      {reviews.length === 0 ? (
        <>
          <h2 className="text-center fs-italic fs-4">
            No articles assigned for review
          </h2>
        </>
      ) : (
        <>
          <h2 className="fs-5 fw-semibold">
            Latest Assigned Articles{" "}
            <span className="badge text-primary">{newCount}</span>
          </h2>
          <hr />
          <div className="row flex-jcenter">
            {reviews.map((review) => (
              <div key={review._id}>
                {review.hasBeenReviewed === false && (
                  <div className="col-md-4 rounded-3 bg-danger-subtle p-3">
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Article: </h2>
                      <h3 className="fs-5">{review.articleId.title} </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Author: </h2>
                      <h3 className="fs-5">
                        {review.articleId.author.authorName}{" "}
                      </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Island: </h2>
                      <h3 className="fs-5">{review.articleId.island.title} </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Published On: </h2>
                      <h3 className="fs-5">
                        {formatDateOrToday(review.articleId.createdAt)}{" "}
                      </h3>
                    </div>
                    <hr />
                    <div className="flex-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          setReviewMode(true);
                          setReviewArticle(review.articleId);
                        }}
                        className="btn btn-danger rounded-0 px-4 flex-acenter gap-2"
                      >
                        <i className="bi bi-pen"></i>
                        Write Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="fs-5 fw-semibold">
            Previously Reviewed Articles{" "}
            <span className="badge text-primary">
              {reviews.length - newCount}
            </span>
          </h2>
          <hr />
          <div className="row flex-jcenter">
            {reviews.map((review) => (
              <div key={review._id}>
                {review.hasBeenReviewed !== false && (
                  <div className="col-md-4 rounded-3 bg-danger-subtle p-3">
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Article: </h2>
                      <h3 className="fs-5">{review.articleId.title} </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Author: </h2>
                      <h3 className="fs-5">
                        {review.articleId.author.authorName}{" "}
                      </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Island: </h2>
                      <h3 className="fs-5">{review.articleId.island.title} </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <h2 className="fs-5 fw-semibold">Published On: </h2>
                      <h3 className="fs-5">
                        {formatDateOrToday(review.articleId.createdAt)}{" "}
                      </h3>
                    </div>
                    <hr />
                    <div className="flex-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          setReviewMode(true);
                          setReviewArticle(review.articleId);
                        }}
                        className="btn btn-danger rounded-0 px-4 flex-acenter gap-2"
                      >
                        <i className="bi bi-pen"></i>
                        Add New Comments
                      </button>
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
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {/* Render ReviewDisplayModal if showReviewsModal is true */}
      {showReviewsModal && reviewArticle && (
        <ReviewDisplayModal
          article={reviewArticle}
          close={handleCloseReviewsModal}
        />
      )}
      {reviewMode && (
        <ReviewMode
          article={reviewArticle}
          refresh={getAssignments}
          close={hideReviewMode}
        />
      )}
    </div>
  );
}

export default Review;
