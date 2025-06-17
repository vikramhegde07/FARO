import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../API';

function Samples() {
    const [samples, setSamples] = useState([]);
    const { islandId } = useParams();
    let filter = {}
    const [images, setimages] = useState([]);
    const [sampleId, setSampleId] = useState('');

    function getSamples() {
        axios
            .get(`${API_BASE}/island/${islandId}`)
            .then((response) => {
                setSamples(response.data.islandData.samples);
                setSampleId(response.data.islandData.samples[0]._id);
                setimages(response.data.islandData.samples[0].images)
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        setimages([]);
        if (samples.length !== 0) {
            filter = samples.find(sample => sample._id === sampleId);
            setimages(filter.images);
        }
    }, [sampleId])

    useEffect(() => {
        getSamples();
    }, [])
    return (
        <div className='container-fluid px-4 py-2'>
            <div className="row">
                {samples.length === 0 ? (
                    <h3 className="text-center fst-italic fs-4 text-indigo">Sorry! No samples found.</h3>
                ) : (
                    <>
                        <div className="col-md-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item ">
                                    <p className="text-center mb-0 fw-semibold fs-4">Available Samples</p>
                                </li>
                                {samples.map((sample) => (
                                    <li className="list-group-item ">
                                        <button
                                            type='button'
                                            className={
                                                `btn btn-light mb-0 fw-semibold fs-5 w-100 cursor-pointer 
                                                ${sampleId === sample._id ? "text-indigo" : ""}`
                                            }
                                            onClick={() => { setSampleId(sample._id) }}
                                        >
                                            {sample.name}
                                        </button>
                                    </li>
                                ))}

                            </ul>
                        </div>
                        <div className="vr d-md-block d-none p-0 border border-black"></div>
                        <div className="col-md-8">
                            <div className="row gap-4 justify-content-center">

                                {images.length === 0 ? '' : images.map((image, index) => (
                                    <div className="col-md-12 border border-2 border-black p-2" key={index}>
                                        <img src={image} alt="" className="img-fluid" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Samples
