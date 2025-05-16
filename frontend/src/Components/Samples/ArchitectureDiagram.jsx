import React from 'react'

function ArchitectureDiagram() {
    return (
        <div className='container-fluid px-2 py-3'>
            <h3 className="text-center fw-semibold fs-4">Architecture Diagrams Samples</h3>
            <hr />
            <div className="row">
                <div className="col-md-6 mb-3">
                    <img src="/assets/samples/Architecure Diagrams/azure bricks architecture.png" alt="" className="img-fluid" />
                </div>
                <div className="col-md-6 mb-3">
                    <img src="/assets/samples/Architecure Diagrams/azure bricks delta lake.png" alt="" className="img-fluid" />
                </div>
                <div className="col-md-6 mb-3">
                    <img src="/assets/samples/Architecure Diagrams/azure bricks ETL.png" alt="" className="img-fluid" />
                </div>
                <div className="col-md-6 mb-3">
                    <img src="/assets/samples/Architecure Diagrams/azure bricks streaming.png" alt="" className="img-fluid" />
                </div>
            </div>
        </div>
    )
}

export default ArchitectureDiagram
