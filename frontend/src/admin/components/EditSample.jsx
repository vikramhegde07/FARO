import axios from 'axios';
import React, { useEffect, useState } from 'react'
import API_BASE from '../../API';
import { toast } from 'react-toastify';
import { useLoading } from "../../Context/LoadingContext";

function EditSample({ sample, close, refresh, island }) {
    const [sampleState, setSampleState] = useState(false);
    const [sampleName, setSampleName] = useState('');
    const [fileUploads, setFileUploads] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [previewUrls, setPreviewUrls] = useState([]);
    const [types, setTypes] = useState([]);

    const { showLoading, hideLoading } = useLoading();

    function handleAddImage() {
        if (!inputValue) {
            return toast.error("Select An Image");
        }
        const previewUrl = inputValue ? URL.createObjectURL(inputValue) : null;

        setFileUploads([...fileUploads, inputValue]);
        setPreviewUrls([...previewUrls, previewUrl]);
        setInputValue('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        showLoading();

        const formData = new FormData();
        formData.append("islandId", island._id);
        formData.append("sampleName", sampleName);

        fileUploads.forEach(upload => {
            if (typeof upload === 'string')
                formData.append("prevLink", upload);
            else
                formData.append("images", upload);
        });

        if (sampleState)
            formData.append("sampleId", sample._id)

        axios
            .put(`${API_BASE}/island/samples`, formData)
            .then((response) => {
                toast.success("Sample Added successfully");
                refresh();
                close();
            })
            .catch((error) => {
                console.log(error.response);
            });
        hideLoading();
    }

    function removeIndex(index) {
        let updated = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(updated);
        updated = fileUploads.filter((_, i) => i !== index);
        setFileUploads(updated);
    }

    useEffect(() => {
        if (sample !== null) {
            setSampleState(true);
            setSampleName(sample.name);
            setPreviewUrls(sample.images);
            setFileUploads(sample.images);
        }
        setTypes(island.articleTypes);
    }, []);

    return (
        <div className='my-modal'>
            <div className="container bg-white rounded-3 p-3">

                <div className="flex-jbetween">
                    {sampleState ?
                        <h3 className="fw-semibold text-indigo fs-4">Edit Sample</h3>
                        :
                        <h3 className="fw-semibold text-indigo fs-4">Add Sample</h3>
                    }
                    <ion-icon
                        className="fs-4 cursor-pointer"
                        name="close-outline"
                        onClick={close}
                    ></ion-icon>
                </div>
                <hr />

                <div className="row">
                    <div className="col-md-6">
                        <form className='container-fluid p-3 border border-dark-50 rounded-3' onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="sampleName" className="form-label">Select Article Type</label>
                                <select
                                    name="sampleName"
                                    id="sampleName"
                                    className="form-select"
                                    onChange={(e) => { setSampleName(e.target.value) }}
                                >
                                    <option selected value={null}>Choose article type</option>
                                    {types.map((type, index) => (
                                        <>{sampleState && type === sampleName ? (
                                            <option selected value={type} key={index} >{type}</option>

                                        )
                                            :
                                            <option value={type} key={index} >{type}</option>
                                        }
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imgSelect" className='form-label'>Select Image</label>
                                <input
                                    type="file"
                                    id='imgSelect'
                                    name='imgSelect'
                                    className="form-control mb-2"
                                    onChange={(e) => setInputValue(e.target.files[0])}
                                    accept="image/*"
                                />

                                <button
                                    type='button'
                                    onClick={handleAddImage}
                                    className={`btn btn-success px-3 rounded-0 mt-3 ${inputValue === '' ? 'disabled' : ''} `}
                                >
                                    Add Image
                                </button>
                                <div className="my-3 flex-jend">
                                    <button
                                        type='Submit'
                                        className="btn btn-danger px-3 rounded-0"
                                    >{sampleState ? 'Update Sample' : 'Add Sample'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-6 overflow-y-scroll" style={{ maxHeight: '80vh' }}>
                        <div className='container-fluid p-3 border border-dark-50 rounded-3'>
                            {previewUrls.length !== 0 && (
                                <>
                                    <h2 className="text-center fw-semibold text-indigo fs-5">Preview</h2>
                                    <hr />
                                    {previewUrls.map((url, index) => (
                                        <>
                                            <img src={url} alt="" key={index} className="img-fluid mt-4 border border-black" />
                                            <div className="flex-jend">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger rounded-0"
                                                    onClick={() => { removeIndex(index); }}
                                                >
                                                    <ion-icon className="fs-4" name="trash-outline"></ion-icon>
                                                </button>
                                            </div>
                                        </>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default EditSample;