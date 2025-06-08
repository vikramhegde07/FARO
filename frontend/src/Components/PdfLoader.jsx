import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import { useLoading } from '../Context/LoadingContext';

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const PdfLoader = ({ pdfUrl }) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (!pdfUrl) return;

        const renderPdfPages = async () => {
            showLoading();
            setError(null);
            setImages([]);

            try {
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const pageImages = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                    const imgData = canvas.toDataURL('image/png');
                    pageImages.push(imgData);
                }

                setImages(pageImages);
            } catch (err) {
                console.error('Error rendering PDF:', err);
                setError('Failed to load PDF.');
            } finally {
                hideLoading();
            }
        };

        renderPdfPages();
    }, [pdfUrl]);

    return (
        <div className="mt-3">
            {error && <p className="text-danger">{error}</p>}

            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`Page ${index + 1}`}
                    className="img-fluid mb-3"
                    style={{ border: '1px solid #ccc' }}
                />
            ))}
        </div>
    );
};

export default PdfLoader;
