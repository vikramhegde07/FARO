import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import axios from 'axios';
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../Context/LoadingContext';

const DocxUploader = () => {
    const [parsedHtml, setParsedHtml] = useState('');
    const [parsedBlocks, setParsedBlocks] = useState([]);
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('free');
    const [articleType, setArticleType] = useState('');
    const [author, setAuthor] = useState('');
    const [authorLink, setAuthorLink] = useState('');
    const { showLoading, hideLoading } = useLoading();

    const [linkText, setLinkText] = useState('');
    const [linkHref, setLinkHref] = useState('');
    const [relatedLinks, setRelatedLinks] = useState([]);


    const addRelatedLink = () => {
        if (linkText.trim() && linkHref.trim()) {
            setRelatedLinks([...relatedLinks, { linkText: linkText.trim(), linkAddr: linkHref.trim() }]);
            setLinkText('');
            setLinkHref('');
        } else {
            toast.error('Please provide both link text and URL for related link.');
        }
    }

    const navigator = useNavigate();

    const htmlToBlocks = async (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const blocks = [];
        const imageFiles = [];

        const walkNodes = async (nodeList) => {
            for (const node of nodeList) {
                if (node.nodeType !== 1) continue;

                const tag = node.tagName.toLowerCase();
                const classList = [];

                const isBold = node.style.fontWeight === 'bold' || node.tagName === 'B' || node.tagName === 'STRONG';
                const isItalic = node.style.fontStyle === 'italic' || node.tagName === 'I' || node.tagName === 'EM';
                const isCentered = node.style.textAlign === 'center' || node.classList.contains('text-center');

                if (isBold) classList.push('fw-bold');
                if (isItalic) classList.push('fst-italic');
                if (isCentered) classList.push('text-center');

                // 📌 Handle headings
                if (['h1', 'h2', 'h3'].includes(tag)) {
                    const text = node.textContent.trim();
                    if (text) {
                        blocks.push({
                            type: tag === 'h1' ? 'heading' : 'subheading',
                            value: text,
                            classes: classList.join(' ')
                        });
                    }
                }

                // 📌 Handle paragraphs
                else if (tag === 'p') {
                    const imgs = node.querySelectorAll('img');
                    const links = node.querySelectorAll('a');

                    if (imgs.length > 0) {
                        for (const img of imgs) {
                            if (img.src.startsWith('data:image')) {
                                const blob = await (await fetch(img.src)).blob();
                                imageFiles.push(blob);
                                blocks.push({
                                    type: 'image',
                                    value: 'upload',
                                    classes: ''
                                });
                            } else {
                                blocks.push({
                                    type: 'image',
                                    value: img.src,
                                    classes: ''
                                });
                            }
                        }
                    }

                    if (links.length > 0) {
                        for (const link of links) {
                            blocks.push({
                                type: 'link',
                                value: {
                                    text: link.textContent.trim(),
                                    href: link.getAttribute('href')
                                },
                                classes: ''
                            });
                        }
                    }

                    const text = node.textContent.trim();
                    if (text && imgs.length === 0 && links.length === 0) {
                        blocks.push({
                            type: 'paragraph',
                            value: text,
                            classes: classList.join(' ')
                        });
                    }
                }

                // 📌 Handle bullet/numbered lists
                else if (tag === 'ul' || tag === 'ol') {
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
                            },
                            classes: ''
                        });
                    }
                }

                // ✅ Handle table and SKIP CHILDREN after
                else if (tag === 'table') {
                    const rows = [];
                    node.querySelectorAll('tr').forEach(tr => {
                        const row = [];
                        tr.querySelectorAll('td,th').forEach(cell => {
                            row.push(cell.textContent.trim());
                        });
                        if (row.length > 0) rows.push(row);
                    });
                    if (rows.length > 0) {
                        blocks.push({
                            type: 'table',
                            value: rows,
                            classes: classList.join(' ')
                        });
                    }

                    // 🛑 SKIP children after handling table
                    continue;
                }

                // 🔁 Walk children (if not table)
                if (tag !== 'table' && node.children.length > 0) {
                    await walkNodes([...node.children]);
                }
            }
        };


        await walkNodes([...doc.body.children]);
        console.log(blocks);
        return { blocks, imageFiles };
    };


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(async (result) => {
                    setParsedHtml(result.value);
                    const { blocks, imageFiles } = await htmlToBlocks(result.value);
                    setParsedBlocks({ blocks, imageFiles });
                })
                .catch((err) => {
                    console.error('Error parsing docx', err);
                });
        }
    };

    const handlePublish = async () => {
        if (!title || !island || !parsedBlocks.blocks?.length) {
            alert('Please fill all details and upload a valid DOCX file.');
            return;
        }
        showLoading();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('island', island);
        formData.append('tier', tier);
        formData.append('articleType', articleType);
        formData.append('author', JSON.stringify({
            authorName: author,
            linkToProfile: authorLink
        }));
        formData.append('content', JSON.stringify(parsedBlocks.blocks));

        parsedBlocks.imageFiles?.forEach((file) => {
            formData.append('images', file);
        });

        const token = localStorage.getItem('faro-user');

        try {
            const res = await axios.post(`${API_BASE}/article/create/parser`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            localStorage.removeItem('faro-title');
            localStorage.removeItem('faro-island');
            localStorage.removeItem('faro-tier');
            localStorage.removeItem('faro-articleType');
            localStorage.removeItem('faro-author');
            localStorage.removeItem('faro-authorLink');

            toast.success('Article Submitted successfully!');
            navigator('/account');
        } catch (error) {
            toast.error('Error while submitting article!');
        }
        hideLoading();
    };


    function handleCancel() {
        localStorage.removeItem('faro-title');
        localStorage.removeItem('faro-island');
        localStorage.removeItem('faro-tier');
        localStorage.removeItem('faro-articleType');
        localStorage.removeItem('faro-author');
        localStorage.removeItem('faro-authorLink');
        navigator('/account');
    };

    useEffect(() => {
        setTitle(localStorage.getItem('faro-title'));
        setIsland(localStorage.getItem('faro-island'));
        setTier(localStorage.getItem('faro-tier'));
        setArticleType(localStorage.getItem('faro-articleType'));
        setAuthor(localStorage.getItem('faro-author'));
        setAuthorLink(localStorage.getItem('faro-authorLink'));
    }, []);

    return (
        <>
            <div className="container p-5">
                <div className="row gap-3">

                    <div className="col-md-6">
                        <h3>Upload DOCX and Parse</h3>
                        <input type="file" accept=".docx" className="form-control mb-3" onChange={handleFileUpload} />
                    </div>
                    <div className='col-md-4 '>
                        <h5>Related Links</h5>
                        <div className="mb-3">
                            <input type="text" className="form-control mb-2" placeholder="Link Text" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
                            <input type="text" className="form-control mb-2" placeholder="Link URL" value={linkHref} onChange={(e) => setLinkHref(e.target.value)} />
                            <button className="btn btn-dark rounded-0 px-4" onClick={addRelatedLink} disabled={!linkText.trim() || !linkHref.trim()}>Add Related Link</button>
                        </div>

                        {relatedLinks.map((link, idx) => (
                            <div className='flex-acenter justify-content-between gap-3 bg-light p-3'>
                                <a href={link.linkAddr} key={idx} target="_blank" rel="noreferrer">{link.linkText}</a>
                                <button className="btn btn-sm btn-outline-danger rounded-0" onClick={() => setRelatedLinks(relatedLinks.filter((_, i) => i !== idx))}>
                                    <ion-icon name="close-outline"></ion-icon>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container my-4">
                <h4>Preview:</h4>
                <div className="border p-3" dangerouslySetInnerHTML={{ __html: parsedHtml }}></div>
            </div>
            <hr />
            <div className="flex-center py-3 gap-3">
                <button onClick={handleCancel} className="btn btn-danger px-4 rounded-0">Cancel</button>
                <button onClick={handlePublish} className="btn btn-success px-4 rounded-0">Publish Article</button>
            </div>
        </>
    );
};

export default DocxUploader;
