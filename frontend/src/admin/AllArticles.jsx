import React from 'react';
import { Link } from 'react-router-dom';

function AllArticles() {
    return (
        <div className='admin-content px-2  mt-4'>
            <h1 className="text-center fw-bold">Manage Articles</h1>
            <hr />
            <div className="row">
                <div className="col-md-3">
                    <h1 className="text-center fs-4">Article  Stats</h1>
                    <ul className="list-group">
                        <Link className="list-group-item flex-jbetween">
                            <h5 className='text-decoration-none text-black fs-6'>All Articles</h5>
                            <span class="badge text-bg-primary">1</span>
                        </Link>
                        <Link to={''} className="list-group-item flex-jbetween">
                            <h5 className='text-decoration-none text-black fs-6'>Approved Articles</h5>
                            <span class="badge text-bg-primary">1</span>
                        </Link>
                        <Link to={''} className="list-group-item flex-jbetween">
                            <h5 className='text-decoration-none text-black fs-6'>Approval Pending</h5>
                            <span class="badge text-bg-warning">1</span>
                        </Link>
                        <Link to={''} className="list-group-item flex-jbetween">
                            <h5 className='text-decoration-none text-black fs-6'>Review Pending</h5>
                            <span class="badge text-bg-danger">1</span>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AllArticles
