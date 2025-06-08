import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import API_BASE from '../API';
import { toast } from 'react-toastify';
import { useLoading } from '../Context/LoadingContext';
import axios from 'axios';
import { useEffect } from 'react';

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UploadPdf = () => {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const [title, setTitle] = useState('');
    const [island, setIsland] = useState('');
    const [tier, setTier] = useState('free');
    const [articleType, setArticleType] = useState('');
    const [author, setAuthor] = useState('');
    const [authorLink, setAuthorLink] = useState('');

    const renderPdfToImages = async (pdfFile) => {
        const fileReader = new FileReader();

        fileReader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            const pages = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;
                pages.push(canvas.toDataURL('image/png'));
            }

            setImages(pages);
        };

        fileReader.readAsArrayBuffer(pdfFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            renderPdfToImages(selectedFile);
        } else {
            alert('Please select a valid PDF file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload a file first.');
        showLoading();
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', title);
        formData.append('island', island);
        formData.append('tier', tier);
        formData.append('articleType', articleType);
        formData.append('author', JSON.stringify({
            authorName: author,
            linkToProfile: authorLink
        }));

        axios
            .post(`${API_BASE}/article/create/pdf`, formData, {
                headers: {
                    Authorization: localStorage.getItem('faro-user')
                }
            })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Uploading successfull");
                    localStorage.removeItem('faro-title');
                    localStorage.removeItem('faro-island');
                    localStorage.removeItem('faro-tier');
                    localStorage.removeItem('faro-articleType');
                    localStorage.removeItem('faro-author');
                    localStorage.removeItem('faro-authorLink');
                }
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Error while uploading");
            });
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
        <div className="container mt-4">
            <h2 className="mb-3">Upload and Preview PDF</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="file"
                        accept="application/pdf"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </div>

                {images.length > 0 && (
                    <div className="mb-3">
                        <h5>Preview:</h5>
                        {images.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`Page ${index + 1}`}
                                className="img-fluid mb-3"
                                style={{ border: '1px solid #ccc' }}
                            />
                        ))}
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Submit PDF
                </button>
            </form>
        </div>
    );
};

export default UploadPdf;
