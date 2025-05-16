import React from 'react'

function ReferenceDiagram() {
    return (
        <div className='container-fluid px-2 py-3'>
            <h3 className="text-center fw-semibold fs-4">Reference Diagrams Samples</h3>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <img src="/assets/samples/Reference Diagrams/Activity-Diagram-ATM.png" alt="" className="img-fluid" />
                    <p className="text-center fst-italic">ATM Activity Diagram</p>
                </div>
                <div className="col-md-6">
                    <img src="/assets/samples/Reference Diagrams/classDiagramInitial.jpg" alt="" className="img-fluid" />
                    <p className="text-center fst-italic">Initial Class Diagram</p>
                </div>
                <div className="col-md-6">
                    <img src="/assets/samples/Reference Diagrams/data-flow-diagram-example-extended.png" alt="" className="img-fluid" />
                    <p className="text-center fst-italic">Data-Flow-Diagram</p>
                </div>
                <div className="col-md-6">
                    <img src="/assets/samples/Reference Diagrams/deployment-diagram-overview-specification.png" alt="" className="img-fluid" />
                    <p className="text-center fst-italic">Overview of Deployment Diagram</p>
                </div>
            </div>

        </div>
    )
}

export default ReferenceDiagram
