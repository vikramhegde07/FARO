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
                    <h1 className='fs-2'>{article.title}</h1>
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
                                <img src={`${API_BASE}${item.value}`} alt="" className='img-fluid' />
                            ) : item.type == 'heading' ? (
                                <h1 className='fw-bold'>{item.value}</h1>
                            ) : item.type == 'subheading' ? (
                                <h3 className='fw-semibold'>{item.value}</h3>
                            ) : item.type == 'link' ? (
                                <a href={item.value.href} className='d-block'>{item.value.text}</a>
                            ) : ''}
                        </div>
                    ))}
                </div>
            )}

        </>
    )

}

export default Article
