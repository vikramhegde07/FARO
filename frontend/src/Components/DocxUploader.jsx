import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import axios from 'axios';
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DocxUploader = () => {
    const [parsedHtml, setParsedHtml] = useState('');
    const [parsedBlocks, setParsedBlocks] = useState([]);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('free');

    const navigator = useNavigate();

    const uploadImageToServer = async (base64Data) => {
        try {
            const formData = new FormData();
            const blob = await (await fetch(base64Data)).blob();
            formData.append('image', blob, 'image.png');

            const response = await axios.post(`${API_BASE}/article/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const htmlToBlocks = async (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const blocks = [];

        const walkNodes = async (nodeList) => {
            for (const node of nodeList) {
                if (node.nodeType !== 1) continue;

                const tag = node.tagName.toLowerCase();

                if (['h1', 'h2', 'h3'].includes(tag)) {
                    const text = node.textContent.trim();
                    if (text) {
                        blocks.push({
                            type: tag === 'h1' ? 'heading' : 'subheading',
                            value: text
                        });
                    }
                } else if (tag === 'p') {
                    const imgs = node.querySelectorAll('img');
                    if (imgs.length > 0) {
                        for (const img of imgs) {
                            if (img.src.startsWith('data:image')) {
                                const uploadedUrl = await uploadImageToServer(img.src);
                                if (uploadedUrl) {
                                    blocks.push({
                                        type: 'image',
                                        value: uploadedUrl
                                    });
                                }
                            } else {
                                blocks.push({
                                    type: 'image',
                                    value: img.src
                                });
                            }
                        }
                    }

                    const links = node.querySelectorAll('a');
                    if (links.length > 0) {
                        for (const link of links) {
                            blocks.push({
                                type: 'link',
                                value: {
                                    text: link.textContent.trim(),
                                    href: link.getAttribute('href')
                                }
                            });
                        }
                    }

                    const text = node.textContent.trim();
                    if (text && imgs.length === 0 && links.length === 0) {
                        blocks.push({
                            type: 'paragraph',
                            value: text
                        });
                    }
                } else if (tag === 'ul' || tag === 'ol') {
                    const items = [];
                    node.querySelectorAll('li').forEach(li => {
                        const liText = li.textContent.trim();
                        if (liText) items.push(liText);
                    });
                    if (items.length) {
                        blocks.push({
                            type: 'points',
                            value: {
                                listType: tag,
                                items
                            }
                        });
                    }
                }

                if (node.children.length > 0) {
                    await walkNodes([...node.children]);
                }
            }
        };

        await walkNodes([...doc.body.children]);
        return blocks;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(async (result) => {
                    setParsedHtml(result.value);
                    const blocks = await htmlToBlocks(result.value);
                    console.log(blocks);
                    setParsedBlocks(blocks);
                })
                .catch((err) => {
                    console.error('Error parsing docx', err);
                });
        }
    };

    const handlePublish = async () => {
        if (!title || !island || parsedBlocks.length === 0) {
            alert('Please fill all details and upload a valid DOCX file.');
            return;
        }

        const articleData = {
            title,
            island,
            tier,
            content: parsedBlocks,
        };

        const token = localStorage.getItem('faro-user');
        axios
            .post(`${API_BASE}/article/create/parser`, articleData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                localStorage.removeItem('faro-title');
                localStorage.removeItem('faro-island');
                localStorage.removeItem('faro-tier');
                toast.success("Article Submitted successfully!");
                navigator('/account');
            })
            .catch((error) => {
                toast.error("Error while submitting article!");
            })

    };


    useEffect(() => {
        setTitle(localStorage.getItem('faro-title'));
        setIsland(localStorage.getItem('faro-island'));
        setTier(localStorage.getItem('faro-tier'));
    }, []);

    return (
        <>
            <div className="container p-5 flex-center">
                <div className="col-md-6">
                    <h3>Upload DOCX and Parse</h3>
                    <input type="file" accept=".docx" className="form-control mb-3" onChange={handleFileUpload} />
                </div>
            </div>
            <div className="container my-4">
                <h4>Preview:</h4>
                <div className="border p-3" dangerouslySetInnerHTML={{ __html: parsedHtml }}></div>
            </div>
            <hr />
            <div className="flex-center py-3">
                <button onClick={handlePublish} className="btn btn-success">Publish Article</button>
            </div>
        </>
    );
};

export default DocxUploader;
