import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE from "../API";
import { toast } from "react-toastify";
import { formatDateOrToday } from "../utils/dateFormatter";
import ReviewDisplayModal from "../Components/ReviewDisplayModal";

function Reviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false); // State to control modal visibility
  const [reviewArticle, setReviewArticle] = useState({});

  const handleOpenReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);
  };
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

  useEffect(() => {
    getAllReviews();
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
          <div className="row gap-1">
            {allReviews.map((review) => (
              <div className="col-md-3 py-3 px-2 shadow-sm bg-danger-subtle rounded-2">
                <div className="flex-acenter gap-1 mb-2">
                  <h2 className="fw-semibold fs-5 mb-0">Article : </h2>
                  <p className="fs-5 mb-0">{review.articleId.title}</p>
                </div>
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
                <div className="flex-acenter gap-1 mb-2">
                  <h2 className="fw-semibold fs-5 mb-0">Reviewed On : </h2>
                  <p className="fs-5 mb-0">
                    {formatDateOrToday(review.createdAt)}
                  </p>
                </div>
                <div className="flex-center">
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
          </div>
        )}
      </div>
      {/* Render ReviewDisplayModal if showReviewsModal is true */}
      {showReviewsModal && reviewArticle && (
        <ReviewDisplayModal
          article={reviewArticle}
          close={handleCloseReviewsModal}
        />
      )}
    </div>
  );
}

export default Reviews;
