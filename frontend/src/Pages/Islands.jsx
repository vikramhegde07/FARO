import React, { useEffect, useState } from 'react'
import axios from 'axios';
import IslandCanvas from '../Components/IslandCanvas';
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
            <div className="container-fluid px-5 py-3 flex-jbetween bg-light border-bottom">
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
                        <div className="col-md-6 col-lg-4 col-sm-12 p-3 " key={island._id}>
                            <IslandCanvas title={island.title} />
                            <div className="flex-center">
                                <Link to={`/island/${island._id}`} className='btn btn-dark'>Visit Island</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Islands
