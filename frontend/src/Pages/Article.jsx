import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useNavigate was imported but not used, so removed for conciseness
import API_BASE from '../API';
import { useLoading } from '../Context/LoadingContext';
import PdfLoader from '../Components/PdfLoader';

function Article() {
    const [article, setArticle] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { id } = useParams();

    function getArticleData() {
        axios
            .get(`${API_BASE}/article/${id}`)
            .then((response) => {
                console.log(response.data);
                setArticle(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    useEffect(() => {
        showLoading();
        getArticleData();
        hideLoading();
    }, []);

    return (
        <>
            {article == null ? '' : (
                <div className='container-fluid p-5'>
                    <div className="row">
                        <div className="col-md-9 position-relative">
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
                        <div className="col-md-3">
                            {/* Add widgets or related articles if needed */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Article;