import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE from '../API';


function Islands() {
    const [search, setSearch] = useState('');
    const [islands, setIslands] = useState([]);

    function handleSearch(e) {
        e.preventDefault();
    }

    function getIslands() {
        axios
            .get(`${API_BASE}/island`)
            .then((response) => {
                setIslands(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }

    useEffect(() => {
        getIslands();
    }, [])
    return (
        <>
            <div className="container-fluid px-5 py-3 flex-jbetween flex-md-row flex-column bg-light border-bottom">
                <h2 className="fs-3">Discover Islands of Knowledge</h2>
                <div className='flex-jcenter gap-2'>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="form-control"
                        onClick={(e) => { setSearch(e.target.value) }}
                    />
                    <button className="btn btn-outline-success" onClick={handleSearch} type='button'>Search</button>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row p-2">
                    {islands.length == 0 ? '' : islands.map((island) => (
                        <div className='col-md-4 flex-center py-5 position-relative' key={island._id}>
                            <Link to={`/island/${island._id}`} className="bg-island" style={{ maxWidth: "450px" }}>
                                <h3>{island.title}</h3>
                            </Link>
                            <div className="island-slider w-100"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Islands
