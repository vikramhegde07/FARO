import { useEffect, useState } from "react";
import { useLoading } from "../Context/LoadingContext";

function ReviewMode({ article, refresh, close }) {
  const { showLoading, hideLoading } = useLoading();
  const [reviewContent, setReviewContent] = useState([]); // To store comments for each content block
  const [activeCommentIndex, setActiveCommentIndex] = useState(null); // To manage which collapse is open

  useEffect(() => {
    // Initialize reviewContent based on article's content structure
    if (article && article.content) {
      const initialReviewContent = article.content.map((item, idx) => ({
        index: idx, // Use the actual index of the content block
        comment: "", // Initialize with an empty comment
      }));
      setReviewContent(initialReviewContent);
    }
  }, [article]);

  const handleCommentChange = (idx, value) => {
    setReviewContent((prev) =>
      prev.map((item) =>
        item.index === idx ? { ...item, comment: value } : item
      )
    );
  };

  const toggleCommentCollapse = (idx) => {
    setActiveCommentIndex(activeCommentIndex === idx ? null : idx);
  };

  const submitReview = async () => {
    showLoading();
    try {
      // Filter out empty comments and map to the required backend format
      const commentsToSubmit = reviewContent
        .filter((item) => item.comment.trim() !== "")
        .map((item) => ({
          index: item.index,
          comment: item.comment.trim(),
        }));

      if (commentsToSubmit.length === 0) {
        alert("Please add at least one comment before submitting.");
        hideLoading();
        return;
      }

      const payload = {
        articleId: article._id,
        content: JSON.stringify(commentsToSubmit),
      };

      console.log(payload);

      // Assuming your backend route for submitting reviews is something like /api/reviews
      await axios.post(`${API_BASE}/review/add`, payload, {
        // Adjust API_BASE and endpoint as needed
        headers: {
          Authorization: localStorage.getItem("faro-user"), // Send auth token
        },
      });

      toast.success("Review submitted successfully!");
      refresh(); // Refresh assignments list in parent component
      close(); // Close the modal
    } catch (error) {
      console.error(
        "Error submitting review:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to submit review. Please try again.");
    } finally {
      hideLoading();
    }
  };

  if (!article) return null; // Don't render if article is not loaded

  return (
    <div className="my-modal">
      <div
        className="container bg-white overflow-y-scroll p-3"
        style={{ maxHeight: "90vh" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{article.title} - Review</h5>
            <button
              type="button"
              className="btn-close"
              onClick={close}
            ></button>
          </div>
          <div className="modal-body p-4">
            {/* Article Content Display */}
            <div className="flex-acenter gap-2 mb-3">
              <img
                src="/assets/img/Logo.jpg"
                alt="Logo"
                className="img-fluid"
                width={30}
              />
              <h1 className="fs-4 text-center text-semibold">
                {article.title}
              </h1>
            </div>
            {article.author && article.author.authorName && (
              <div className="flex-jend mb-3">
                <p className="text-black-50 m-0">
                  - Article by {article.author.authorName}
                </p>
              </div>
            )}
            <hr />

            {article.content.map((item, idx) => (
              <div
                key={item._id || idx}
                className={`position-relative mb-3 ${item.classes}`}
              >
                {/* Render actual content */}
                {item.type === "paragraph" && <p>{item.value}</p>}
                {item.type === "heading" && <h1>{item.value}</h1>}
                {item.type === "subheading" && <h3>{item.value}</h3>}
                {item.type === "image" && (
                  <div className="flex-center">
                    <img
                      src={item.value}
                      alt="article"
                      className="img-fluid"
                      style={{ maxWidth: "600px" }}
                    />
                  </div>
                )}
                {item.type === "link" && (
                  <a
                    href={item.value.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-block"
                  >
                    {item.value.text}
                  </a>
                )}
                {item.type === "points" && (
                  <ul className="ps-4">
                    {item.value.items.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.type === "table" && (
                  <div className="table-responsive overflow-y-scroll my-3">
                    <table className="table table-bordered">
                      <tbody>
                        {item.value.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {item.type === "code" && (
                  <pre className="bg-light p-3 rounded overflow-auto">
                    <code>{item.value.code}</code>
                  </pre>
                )}

                {/* Comment button for each content block */}
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    onClick={() => toggleCommentCollapse(idx)}
                  >
                    <i
                      className={`bi ${
                        activeCommentIndex === idx
                          ? "bi-chat-left-fill"
                          : "bi-chat-left"
                      }`}
                    ></i>
                    {activeCommentIndex === idx
                      ? " Hide Comment"
                      : " Add Comment"}
                  </button>
                </div>

                {/* Bootstrap Collapse for comments */}
                {activeCommentIndex === idx && (
                  <div
                    className="comment-collapse mt-2 p-3 border rounded shadow-sm"
                    style={{
                      position: "relative",
                      zIndex: 1050,
                      backgroundColor: "#f8f9fa",
                    }} // Adjust styling as needed
                  >
                    <label htmlFor={`comment-${idx}`} className="form-label">
                      Your Comment for this section:
                    </label>
                    <textarea
                      id={`comment-${idx}`}
                      className="form-control"
                      rows="3"
                      value={
                        reviewContent.find((rc) => rc.index === idx)?.comment ||
                        ""
                      }
                      onChange={(e) => handleCommentChange(idx, e.target.value)}
                      placeholder="Enter your comment here..."
                    ></textarea>
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr />
          <div className="flex-jend gap-3 px-2">
            <button
              type="button"
              className="btn btn-dark px-3 rounded-0"
              onClick={close}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 rounded-0"
              onClick={submitReview}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReviewMode;
