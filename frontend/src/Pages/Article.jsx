import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE from '../API';
import { toast } from 'react-toastify';

function Article() {
    const [article, setArticle] = useState(null);
    const navigator = useNavigate();
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
            })
    }

    useEffect(() => {
        getArticleData();
    }, [])

    return (
        <>
            {article == null ? '' : (
                <div className='container-fluid p-5'>
                    <div className="row">
                        <div className="col-md-9  position-relative">
                            <div className='flex-acenter'>
                                <img src="/assets/img/Logo.jpg" alt="" className="img-fluid" width={40} />
                                <h1 className='fs-2 text-center text-semibold'>{article.title}</h1>
                            </div>
                            <div className="flex-jend">
                                <p className='text-black-50 m-0'>- Article by {article.author.username}</p>
                            </div>
                            <hr />

                            {article.content.map((item) => (
                                <div key={item._id}>
                                    {item.type == 'paragraph' ? (
                                        <p>{item.value}</p>
                                    ) : item.type == 'points' ? (
                                        <ol>
                                            {item.value.items.map((point) => (
                                                <li>{point}</li>
                                            ))}
                                        </ol>
                                    ) : item.type == 'image' ? (
                                        <div className='flex-center'>
                                            <img src={item.value} alt="" className='img-fluid' />
                                        </div>
                                    ) : item.type == 'heading' ? (
                                        <h1 className='fw-bold'>{item.value}</h1>
                                    ) : item.type == 'subheading' ? (
                                        <h3 className='fw-semibold'>{item.value}</h3>
                                    ) : item.type == 'link' ? (
                                        <a href={item.value.href} className='d-block'>{item.value.text}</a>
                                    ) : ''}
                                </div>
                            ))}
                            {
                                article.relatedFiles.length != 0 ? (
                                    <>
                                        <hr />
                                        <div className='bg-light'>
                                            <h2 className="fw-semibold flex-acenter">
                                                <i className="bi bi-paperclip"></i>
                                                Attached Files
                                            </h2>
                                            {article.relatedFiles.map((file, index) => (
                                                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                                    {file.fileName}
                                                    <a
                                                        href={file.linkToFile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Download
                                                    </a>
                                                </li>))}
                                        </div>
                                    </>
                                ) : ''
                            }

                            {
                                article.relatedLinks.length != 0 ? (
                                    <>
                                        <hr />
                                        <div className='bg-light'>
                                            <h2 className="fw-semibold">Related Links</h2>
                                            {article.relatedLinks.map((link) => (
                                                <a href={link.linkAddr} target='_blank'>{link.linkText}</a>
                                            ))}
                                        </div>
                                    </>
                                ) : ''
                            }
                        </div>
                        <div className="vr d-md-block d-none m-0 g-0 border-black border"></div>
                        <hr className='d-md-none d-block my-3' />
                        <div className="col-md-3">

                        </div>
                    </div>
                </div>
            )}

        </>
    )

}

export default Article
