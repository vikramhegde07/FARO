import React from 'react'

function Disclaimer({ close }) {
    return (
        <div className='my-modal'>
            <div className="bg-white container p-3 rounded-1" style={{ maxWidth: "720px" }}>
                <h3 className="text-center text-indigo fst-italic">Disclaimer</h3>
                <hr />
                <p>
                    Faroport is an article collecting and aggregation platform. Faroport end user agreement insists users to publish indigenous content that may or may not include publicly available information. Faroport strives to moderate private and copyrighted content as much in its review process before publishing.
                </p>
                <div className="flex-jcenter">
                    <button
                        type='button'
                        onClick={close}
                        className="btn btn-primary rounded-0 px-4"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Disclaimer
