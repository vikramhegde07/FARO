import React, { useState } from 'react'

function NextSteps({ plan, close }) {
    return (
        <div className='my-modal'>
            <div className="container p-4 bg-white rounded-3" style={{ maxWidth: "720px" }}>
                <p className='text-center fs-5'>Sorry! The payments is still in development.</p>
                <p className='text-center fs-5'>It will be added soon</p>
                <div className="flex-center">
                    <button
                        type='button'
                        className="btn btn-dark px-3 rounded-0"
                        onClick={close}
                    >Close</button>
                </div>
            </div>
        </div>
    )
}

function Pricing() {
    const [chosen, setChosen] = useState(false);
    const [plan, setPlan] = useState('');

    const closeModal = () => setChosen(false);

    return (
        <div className='container p-4 my-5'>
            <div className="row flex-jcenter gap-3">
                <div className="col-md-4 p-3 bg-info-subtle rounded-3">
                    <h2 className="text-center fs-4 fw-bold">Premium</h2>
                    <h3 className="fw-bold fs-4 text-indigo">₹99 <span className='text-muted fs-5 fw-normal'>/month</span> </h3>
                    <p className="fs-5">Benfits</p>
                    <hr />

                    <p><i className="bi bi-check2-circle text-indigo"></i> Access to all articles of the chosen Island</p>
                    <p><i className="bi bi-check2-circle text-indigo"></i> 5 Comments or question per article</p>

                    <div className="flex-center mt-5">
                        <button
                            type="button"
                            className="btn btn-primary rounded-0 px-3"
                            onClick={() => {
                                setChosen(true);
                                setPlan('premium')
                            }}
                        >
                            Choose Plan
                        </button>
                    </div>
                </div>
            </div>
            {chosen && <NextSteps plan={plan} close={closeModal} />}
        </div>
    )
}

export default Pricing
