import React, { useEffect, useState } from 'react'
import { formatDateOrToday } from '../../utils/dateFormatter';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE from '../../API';
import { useLoading } from '../../Context/LoadingContext';
import ReviewDisplayModal from '../../Components/ReviewDisplayModal';

function Modal({ article, close, refresh }) {

  const { showLoading, hideLoading } = useLoading();

  function handleRemove() {
    showLoading();
    axios
      .delete(`${API_BASE}/article/articleId/${article.id}`, {
        headers: {
          Authorization: localStorage.getItem('faro-user')
        }
      })
      .then((response) => {
        console.log(response);
        toast.success("Article Removed Successfully");
        refresh();
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Sorry! couldn't remove the article");
      });

    hideLoading();
    close();
  }

  return (
    <div className='my-modal'>
      <div className="container bg-white w-75 p-4">
        <div className="flex-jbetween">
          <div className="flex-center gap-2">
            <ion-icon name="warning-outline" className="fs-2 text-danger"></ion-icon>
            <h2 className="fw-semibold fs-3 mb-0">Remove Article</h2>
          </div>
          <button
            type='button'
            className="btn rounded-0 px-4"
            onClick={close}
          >
            <ion-icon name="close-outline" className="fs-2 text-dark"></ion-icon>
          </button>
        </div>
        <hr />
        <div className="mb-3 flex-acenter gap-2">
          <h2 className="fw-semibold fs-4 mb-0">Article Title: </h2>
          <p className="fs-4 mb-0">{article.title}</p>
        </div>
        <div className="mb-3 flex-acenter gap-2">
          <h2 className="fw-semibold fs-4 mb-0">Island: </h2>
          <p className="fs-4 mb-0">{article.island}</p>
        </div>
        <div>
          <p className='fs-5 text-danger'>
            Warning: All the files and all the data of the articles will be removed and cannot be restored.
          </p>
        </div>
        <hr />
        <div className="flex-jend gap-2">
          <button
            type='button'
            className="btn btn-dark px-4 rounded-0"
            onClick={close}
          >
            Close
          </button>
          <button
            type='button'
            className="btn btn-danger px-4 rounded-0"
            onClick={handleRemove}
          >
            Remove Permanently
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignModal({ article, close }) {
  const [users, setUsers] = useState([]);
  const [assignment, setAssignment] = useState([]);

  function setAssigns(e) {
    setAssignment((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((item) => item !== e.target.value);
      } else {
        return [...prev, e.target.value];
      }
    })
  }

  function handleAssign() {
    if (assignment.length === 0)
      alert("Assign atleast 1 person for review");
    else {
      console.log(assignment);

      axios.
        post(`${API_BASE}/assignReview/create`, {
          articleId: article.id,
          users: JSON.stringify({ assignment })
        }, {
          headers: {
            Authorization: localStorage.getItem('faro-user')
          }
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success(response.data.message);
            close();
          } else {
            toast.success(response.data.message);
            close();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status === 401)
            toast.error(error.response.data.error);
          else
            toast.error("Error while assigning the reviews");
        });
    }
  }

  function getUsers() {
    axios
      .get(`${API_BASE}/user/privillaged`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='my-modal'>
      <div className="container bg-white p-4 w-75">
        <div className="flex-jbetween">
          <div className="flex-center gap-2">
            <i className="bi bi-clipboard-plus fs-2 text-primary"></i>
            <h2 className="fw-semibold fs-3 mb-0">Assign Article for Review</h2>
          </div>
          <button
            type='button'
            className="btn rounded-0 px-4"
            onClick={close}
          >
            <ion-icon name="close-outline" className="fs-2 text-dark"></ion-icon>
          </button>
        </div>
        <hr />
        <div className="mb-3 flex-acenter gap-2">
          <h2 className="fw-semibold fs-4 mb-0">Article Title: </h2>
          <p className="fs-4 mb-0">{article.title}</p>
        </div>
        <div className="mb-3 flex-acenter gap-2">
          <h2 className="fw-semibold fs-4 mb-0">Island: </h2>
          <p className="fs-4 mb-0">{article.island}</p>
        </div>
        <hr />
        <h3 className="fs-4">Review Users</h3>
        <div className="flex-acenter gap-2">
          {users.length !== 0 && users.map((user) => (
            <>
              {user.privillage.includes('review') && (
                <button
                  type='button'
                  value={user._id}
                  onClick={setAssigns}
                  className={`btn px-2 btn-sm rounded-0 flex-acenter gap-2 ${assignment.includes(user._id) ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  {user.username}
                  {assignment.includes(user._id) ? (
                    <i className="bi bi-x"></i>
                  ) : (
                    <i className="bi bi-plus"></i>
                  )}
                </button>
              )}
            </>
          ))}
        </div>

        <hr />
        <div className="flex-jend gap-2">
          <button
            type='button'
            className="btn btn-dark px-4 rounded-0"
            onClick={close}
          >
            Close
          </button>
          <button
            type='button'
            className="btn btn-primary px-4 rounded-0"
            onClick={handleAssign}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}

function ApproveModal({ article, close, refresh }) {

  const { showLoading, hideLoading } = useLoading();

  function handleApprove() {
    showLoading();
    const token = localStorage.getItem('faro-user');
    if (!token) {
      toast.error('No user token found');
      return;
    }
    axios
      .patch(`${API_BASE}/article/approve/${article._id}`, {}, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Article Approved");
          refresh();
          close();
        }
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Sorry! Server error");
      });
    hideLoading();
  }
  return (
    <div className='my-modal'>
      <div className="container bg-white p-3" style={{ maxWidth: '560px' }}>
        <div className="flex-jbetween flex-acenter py-2">
          <div className="flex-acenter gap-3">
            <i className="bi bi-check-circle-fill fs-4 text-success"></i>
            <h3 className="fs-4 fw-semibold mb-0">Approve Article</h3>
          </div>
          <button
            type='button'
            className="btn rounded-0 px-4"
            onClick={close}
          >
            <ion-icon name="close-outline" className="fs-2 text-dark"></ion-icon>
          </button>
        </div>
        <hr className='mt-0' />
        <div className="d-flex gap-2">
          <h3 className="fw-semibold fs-5">Article: </h3>
          <h3 className="fs-5">{article.title}</h3>
        </div>
        <div className="d-flex gap-2">
          <h3 className="fw-semibold fs-5">Island: </h3>
          <h3 className="fs-5">{article.island.title}</h3>
        </div>
        <div className="d-flex gap-2">
          <h3 className="fw-semibold fs-5">Published On: </h3>
          <h3 className="fs-5">{formatDateOrToday(article.createdAt)}</h3>
        </div>
        <hr />
        <div className="flex-jend gap-2">
          <button
            type='button'
            className="btn btn-dark px-4 rounded-0"
            onClick={close}
          >
            Close
          </button>
          <button
            type='button'
            className="btn btn-success px-4 rounded-0"
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

function ArticleList({ articles, list, refresh }) {
  const articlePerPage = 15;
  const [page, setPage] = useState(1);
  const [pagedArticles, setPagedArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const listTitles = {
    all: 'All',
    pending: 'Approval Pending',
    review: 'Review Pending',
    approved: 'All Approved'
  }
  const [showReviewsModal, setShowReviewsModal] = useState(false); // State to control modal visibility
  const [action, setAction] = useState('');
  const [modal, setModal] = useState(false);
  const [modalArticle, setModalArticle] = useState({
    id: '',
    title: '',
    island: ''
  });

  const handleOpenReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);
    closeModal();
  };

  const closeModal = () => {
    setAction('');
    setModal(false);
    setModalArticle({
      id: '',
      title: '',
      island: ''
    });
  }

  function paging() {
    setTotalPages(Math.ceil(articles.length / articlePerPage));
    const lastArticleIndex = articlePerPage * page;
    const firstArticleIndex = lastArticleIndex - articlePerPage;
    setPagedArticles(articles.slice(firstArticleIndex, lastArticleIndex));
    console.log(articles);
  }

  useEffect(() => {
    paging();
  }, [page]);

  useEffect(() => {
    paging();
  }, [articles]);

  if (articles.length === 0) return null;

  return (
    <div className="container-fluid px-4 mt-2">
      <h1 className="text-center fw-semibold fs-3">{listTitles[list]} Articles</h1>
      <table className="table table-hover overflow-x-scroll">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Article</th>
            <th scope="col">Island</th>
            <th scope="col">Publish Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {pagedArticles.map((article, index) => (
            <tr key={article._id}>
              <th scope="row">{((page * articlePerPage) - articlePerPage) + (index + 1)}</th>
              <td>
                <Link to={`/admin/article/${article._id}`} className='text-black text-decoration-none'>
                  {article.title}
                </Link>
              </td>
              <td>{article.island.title}</td>
              <td>{formatDateOrToday(article.createdAt)}</td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-danger px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                  </button>
                  <ul className="dropdown-menu">
                    {
                      list !== 'review' ? (
                        <>
                          <li>
                            <button
                              type='button'
                              className="dropdown-item flex-acenter gap-2"
                              onClick={(e) => {
                                setAction('assign');
                                setModalArticle({
                                  id: article._id,
                                  title: article.title,
                                  island: article.island.title
                                });
                                setModal(true);
                              }}
                            >
                              <i className="bi bi-clipboard-plus"></i>
                              Assign for Review
                            </button>
                          </li>
                        </>
                      ) : (
                        <li>
                          <button
                            type='button'
                            className="dropdown-item flex-acenter gap-2"
                            onClick={() => {
                              setModalArticle(article);
                              handleOpenReviewsModal();
                            }}
                          >
                            <ion-icon name="eye-outline"></ion-icon>
                            View Reviews
                          </button>
                        </li>
                      )}
                    {list !== 'approved' ? (
                      <>
                        <li>
                          <button
                            type='button'
                            className="dropdown-item flex-acenter gap-2"
                            onClick={() => {
                              setAction('approve');
                              setModal(true);
                              setModalArticle(article);
                            }}
                          >
                            <i className="bi bi-check-circle-fill"></i>
                            Approve Article
                          </button>
                        </li>
                      </>
                    ) : ''}
                    <li>
                      <Link
                        to={`/admin/edit/${article._id}`}
                        className='dropdown-item flex-acenter gap-2'
                      >
                        <i className="bi bi-pencil-square"></i>
                        Edit
                      </Link>
                    </li>
                    <li>
                      <button
                        type='button'
                        className='dropdown-item flex-acenter gap-2'
                        onClick={(e) => {
                          setAction('remove');
                          setModalArticle({
                            id: article._id,
                            title: article.title,
                            island: article.island.title
                          });
                          setModal(true);
                        }}
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                        Remove
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))
          }

        </tbody>
      </table>

      <div className="container mt-4">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {page !== 1 && (
              <li className="page-item">
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
            )}
            {page - 1 > 0 && (
              <li className="page-item">
                <button
                  type='button'
                  className="page-link"
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >{page - 1}</button>
              </li>
            )}
            <li className="page-item active">
              <button className="page-link">{page}</button>
            </li>
            {page + 1 <= totalPages && (
              <li className="page-item">
                <button
                  type='button'
                  className="page-link"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >{page + 1}</button>
              </li>
            )}
            {totalPages !== page && (
              <li className="page-item">
                <button
                  type='button'
                  className="page-link"
                  aria-label="Next"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {action === 'remove' && modal && <Modal article={modalArticle} close={closeModal} refresh={refresh} />}
      {action === 'assign' && modal && <AssignModal article={modalArticle} close={closeModal} />}
      {action === 'approve' && modal && <ApproveModal article={modalArticle} close={closeModal} refresh={refresh} />}
      {showReviewsModal && modalArticle && <ReviewDisplayModal article={modalArticle} close={handleCloseReviewsModal} />}
    </div >
  )
}

export default ArticleList
