import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE from '../API';

function EditModal({ title, id, close, refresh }) {
    const [newTitle, setNewTitle] = useState();

    function handleEditing(e) {
        e.preventDefault();

        if (newTitle === title) {
            toast.error('No change in the title detected');
            close();
        }

        axios
            .patch(`${API_BASE}/island/edit`, {
                title: newTitle,
                islandId: id
            })
            .then((response) => {
                if (response.status === 200)
                    toast.success("Island title changed successfully!");
                setNewTitle('');
                refresh();
                close();
            })
            .catch((err) => {
                console.log(err.response);
                toast.error("Error! Sorry could not update island title")
            })

    }

    useEffect(() => {
        setNewTitle(title);
    }, [title])

    return (
        <>
            <div className="my-modal">
                <div className="col-4 bg-white p-4">
                    <div className="flex-jbetween">
                        <h1 className="text-center fs-3">Edit Title</h1>
                        <ion-icon
                            name="close-outline"
                            className="text-black-50 fs-2 cursor-pointer"
                            onClick={() => { close(); }}
                        ></ion-icon>
                    </div>
                    <hr />
                    <form onSubmit={handleEditing}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Island Title</label>
                            <input
                                type="text"
                                onChange={(e) => { setNewTitle(e.target.value) }}
                                className="form-control rounded-0"
                                name='title'
                                id='title'
                                value={newTitle}
                            />
                        </div>
                        <hr />
                        <div className="flex-jend">
                            <button
                                type="button"
                                className="btn btn-dark px-4 rounded-0 me-2"
                                onClick={close}
                            >Cancel</button>
                            <button type="submit" className="btn btn-danger px-4 rounded-0">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

function RemoveModal({ title, id, close, refresh }) {

    function handleRemove() {
        axios
            .delete(`${API_BASE}/island/delete/${id}`)
            .then((response) => {
                if (response.status == 200)
                    toast.success("Island removed successfully!");
                refresh();
                close();
            })
            .catch((err) => {
                console.log(err.response.data);
                toast.error("Sorry! some error occured while deleting");
                close();
            })
    }

    return (
        <>
            <div className="my-modal">
                <div className="col-4 bg-white p-4">
                    <div className="flex-jbetween">
                        <div>
                            <h1 className="flex-acenter fs-3">
                                <ion-icon name="warning-outline" className="text-danger"></ion-icon>
                                Removing Island
                            </h1>
                        </div>
                        <ion-icon
                            name="close-outline"
                            className="text-black-50 fs-2 cursor-pointer"
                            onClick={() => { close(); }}
                        ></ion-icon>
                    </div>
                    <hr />

                    <h5 className="fs-5 text-danger flex-acenter">
                        Warning: All articles and reviews published under island will be removed.
                    </h5>
                    <p className='fs-18 mb-0'>
                        Title : {title}
                    </p>
                    <hr />
                    <div className="flex-jend">
                        <button
                            type="button"
                            className="btn btn-dark px-4 rounded-0 me-2"
                            onClick={close}
                        >Cancel</button>
                        <button type='button' onClick={handleRemove} className="btn btn-danger px-4 rounded-0">Remove</button>
                    </div>
                </div>
            </div>
        </>
    )
}

function Islands() {

    const [allIslands, setAllIslands] = useState([]);
    const [newIsland, setNewIsland] = useState('');

    const [editingData, setEditingData] = useState({
        title: null,
        id: null
    });

    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);

    const handleEditClose = () => {
        setEdit(false);
        setRemove(false);
        setEditingData({
            title: null,
            id: null
        });
    }

    function handleAddIsland(e) {
        e.preventDefault();
        axios
            .post(`${API_BASE}/island/create`, { title: newIsland })
            .then((response) => {
                toast.success(response.data.message);
                setNewIsland('');
                getAllIslands();
            })
            .catch((err) => {
                console.log("Error! Sorry could not add new island");
            })
    }

    function getAllIslands() {
        setAllIslands([]);
        axios
            .get(`${API_BASE}/island`)
            .then((response) => {
                setAllIslands(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                toast.error('Sorry! Error while fetching island data.');
            })
    }

    useEffect(() => {
        getAllIslands();
    }, [])

    return (
        <>
            <h2 className="text-center fw-semibold">Manage Islands</h2>
            <hr />
            <div className="container-fluid px-3 py-2">
                <div className="row">
                    <div className="col-md-6 p-3">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <h1 className="text-center fw-semibold fs-3">All Islands</h1>
                            </li>
                            {allIslands.length !== 0 ?
                                allIslands.map((island) => (
                                    <li className="list-group-item hover-bg-gray flex-jbetween flex-acenter hover-op-container" key={island._id} >
                                        <Link to={`/admin/island/${island._id}`} className='fs-18 text-decoration-none text-black'>
                                            {island.title}
                                        </Link>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary rounded-0 hover-opacity"
                                                onClick={() => {
                                                    setEditingData({
                                                        title: island.title,
                                                        id: island._id
                                                    });
                                                    setEdit(true);
                                                }}
                                            >
                                                <ion-icon name="pencil-outline"></ion-icon>
                                            </button>
                                            <button
                                                className="btn btn-danger rounded-0 hover-opacity"
                                                onClick={() => {
                                                    setEditingData({
                                                        title: island.title,
                                                        id: island._id
                                                    });
                                                    setRemove(true);
                                                }}
                                            >
                                                <ion-icon name="trash-outline"></ion-icon>
                                            </button>
                                        </div>
                                    </li>
                                )) : ''
                            }
                        </ul>
                    </div>
                    <div className="col-md-6 p-3">
                        <div className="bg-danger-subtle px-5 py-3">
                            <h1 className="text-center">Add New Island</h1>
                            <hr />
                            <form onSubmit={handleAddIsland}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Island Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        onChange={(e) => { setNewIsland(e.target.value) }}
                                        className="form-control rounded-0"
                                        value={newIsland}
                                        required
                                    />
                                </div>
                                <div className="mb-3 flex-jend">
                                    <button type="submit" className="btn btn-danger px-4 rounded-0">Add Island</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {!edit ? '' : <EditModal title={editingData.title} id={editingData.id} close={handleEditClose} refresh={getAllIslands} />}
            {!remove ? '' : <RemoveModal title={editingData.title} id={editingData.id} close={handleEditClose} refresh={getAllIslands} />}
        </>
    )
}

export default Islands
