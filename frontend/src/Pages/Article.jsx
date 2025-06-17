import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useNavigate was imported but not used, so removed for conciseness
import API_BASE from '../API';
import { useLoading } from '../Context/LoadingContext';
import PdfLoader from '../Components/PdfLoader';
import { toast } from 'react-toastify';
import { formatDateOrToday } from '../utils/dateFormatter';
import Disclaimer from '../Components/Disclaimer';

function Article() {
    const [article, setArticle] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { id } = useParams();

    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const closeDisclaimer = () => { setShowDisclaimer(false) }

    const [allComments, setAllComments] = useState([]);
    const [remaining, setremaining] = useState(0);
    const [subscribed, setSubscribed] = useState(false);
    const [newComment, setNewComment] = useState();

    function getArticleData() {
        showLoading();
        setArticle(null);
        axios
            .get(`${API_BASE}/article/${id}`)
            .then((response) => {
                setArticle(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
        hideLoading();
    }

    function getComments() {
        showLoading();
        setAllComments([]);
        axios
            .get(`${API_BASE}/comment/article/${id}`)
            .then((response) => {
                setAllComments(response.data.comments);
                console.log(response.data.comments);

            })
            .catch((error) => {
                console.log(error.response);
            })
        hideLoading();
    }

    function getCommentAccess() {
        showLoading();
        setSubscribed(false);
        setremaining(0);
        axios
            .get(`${API_BASE}/comment/checkAccess/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setremaining(response.data.remaining);
                    setSubscribed(true);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
        hideLoading();
    }

    function handleAddComment(e) {
        e.preventDefault();
        showLoading();

        if (newComment === '')
            return toast.error("Please add your comment before submitting");

        const formData = {};
        formData.articleId = id;
        formData.message = newComment;

        axios
            .post(`${API_BASE}/comment/create`, formData, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                console.log(response.data);
                getComments();
                setremaining(remaining - 1);
                setNewComment('');
            })
            .catch((error) => {
                console.log(error.response);
            });
        hideLoading();
    }

    useEffect(() => {
        getArticleData();
        getComments();
        getCommentAccess();
    }, []);

    return (
        <>
            {article !== null && (
                <div className="row py-5 ps-4">
                    <div className="col-md-9 position-relative" style={{ maxWidth: "1020px" }}>
                        <div className='flex-acenter gap-2'>
                            <img src="/assets/img/Logo.jpg" alt="Logo" className="img-fluid" width={40} />
                            <h1 className='fs-2 text-center text-semibold'>{article.title}</h1>
                        </div>
                        {article.author && article.author.authorName ? ( // Added a check for article.author to prevent errors if it's null
                            <div className="flex-jend">
                                <p className='text-black-50 m-0'>- Article by {article.author.authorName}</p>
                            </div>
                        ) : ''}

                        <hr />

                        {article.content.map((item, idx) => (
                            <div key={item._id || idx} className={item.classes}>
                                {item.type === 'paragraph' && <p>{item.value}</p>}
                                {item.type === 'heading' && <h1>{item.value}</h1>}
                                {item.type === 'subheading' && <h3>{item.value}</h3>}
                                {item.type === 'image' && (
                                    <div className='flex-center'>
                                        <img src={item.value} alt="article" className='img-fluid' />
                                    </div>
                                )}
                                {item.type === 'link' && (
                                    <a href={item.value.href} target="_blank" rel="noopener noreferrer" className='d-block'>
                                        {item.value.text}
                                    </a>
                                )}
                                {item.type === 'points' && (
                                    <ul className='ps-4'>
                                        {item.value.items.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                )}
                                {item.type === 'table' && (
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
                                {/* New condition to display code snippet */}
                                {item.type === 'code' && (
                                    <>
                                        <pre className="bg-light p-3 rounded overflow-y-scroll" style={{ maxHeight: "60vh" }}>
                                            <code>{item.value.code}</code>
                                        </pre>
                                    </>
                                )}
                                {/* new condition to display pdf */}
                                {item.type === 'pdf' && (
                                    <>
                                        <PdfLoader pdfUrl={item.value} />
                                    </>
                                )}
                            </div>
                        ))}

                        {article.relatedLinks.length > 0 && (
                            <>
                                <hr />
                                <div className='bg-light p-3'>
                                    <h2 className="fw-semibold mb-3">Related Links</h2>
                                    <ul>
                                        {article.relatedLinks.map((link, index) => (
                                            <li key={index}>
                                                <a href={link.linkAddr} target='_blank' rel="noopener noreferrer">
                                                    {link.linkText}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column (optional use) */}
                    <div className="vr d-md-block d-none m-0 g-0 border-black border"></div>
                    <hr className='d-md-none d-block my-3' />
                    <div className="col-3 flex-acenter flex-column">
                        {allComments.length === 0 && (
                            <h3 className="text-center fs-4 fst-italic fw-semibold">No Comments yet!</h3>
                        )}
                        <form className='w-100' onSubmit={handleAddComment}>
                            <div className="mb-3">
                                <label htmlFor="comment" className="form-label">Add Comment</label>
                                <textarea
                                    name="comment"
                                    id="comment"
                                    rows={5}
                                    className='form-control'
                                    value={newComment}
                                    onChange={(e) => { setNewComment(e.target.value) }}
                                    placeholder='Add new Comment'
                                    disabled={(subscribed && remaining > 0) ? false : true}
                                ></textarea>
                            </div>
                            <div className="flex-jend">
                                <button
                                    type="submit"
                                    className="btn btn-danger px-3 rounded-0"
                                    disabled={(subscribed && remaining > 0 && newComment !== '') ? false : true}
                                >
                                    Comment
                                </button>
                            </div>
                        </form>
                        {allComments.length !== 0 && (
                            <div className='mt-4 w-100'>
                                <h3 className="text-center fs-4 fw-semibold">Comments</h3>
                                <hr className='w-100 mt-0' />
                                {allComments.map((comment) => (
                                    <div className="w-full p-3 my-3 shadow-sm rounded-3 bg-info-subtle" key={comment._id}>
                                        <div className="flex-jend">
                                            <p className="fs-small m-0">{formatDateOrToday(comment.createdAt)}</p>
                                        </div>
                                        <p className="fs-6 text-indigo fw-semibold m-0">{comment.userId.username}</p>
                                        <hr className='m-1' />
                                        <p className="fs-6">{comment.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div >
            )
            }
            {showDisclaimer && <Disclaimer close={closeDisclaimer} />}
        </>
    );
}

export default Article;