import React, { useState } from 'react'
import ReferenceDiagram from '../Components/Samples/ReferenceDiagram';
import ArchitectureDiagram from '../Components/Samples/ArchitectureDiagram';
import CheatSheet from '../Components/Samples/CheatSheet';

function Samples() {

    const [sample, setSample] = useState('rfd');

    return (
        <div className='container-fluid px-4 py-2'>
            <div className="row">
                <div className="col-md-3">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item ">
                            <p className="text-center mb-0 fw-semibold fs-4">Features</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('rfd') }}>
                            <p className="mb-0 fs-18">Reference Diagrams</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('act') }}>
                            <p className="mb-0 fs-18">Architecture Templates</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('acd') }}>
                            <p className="mb-0 fs-18">Architecture Diagrams</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('csh') }}>
                            <p className="mb-0 fs-18">Cheatsheets</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('csn') }}>
                            <p className="mb-0 fs-18">Code Snippets</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('ddt') }}>
                            <p className="mb-0 fs-18">Design Docs & Templates</p>
                        </li>
                        <li className="list-group-item cursor-pointer" onClick={() => { setSample('pti') }}>
                            <p className="mb-0 fs-18">Professional Tools Intro</p>
                        </li>
                    </ul>
                </div>
                <div className="vr d-md-block d-none p-0 border border-black"></div>
                <div className="col-md-8">
                    {sample === 'rfd' && (<ReferenceDiagram />)}
                    {sample === 'act' && (<></>)}
                    {sample === 'acd' && (<ArchitectureDiagram />)}
                    {sample === 'csh' && (<CheatSheet />)}
                    {sample === 'csn' && (<></>)}
                    {sample === 'ddt' && (<></>)}
                    {sample === 'pti' && (<></>)}
                </div>
            </div>
        </div>
    )
}

export default Samples
