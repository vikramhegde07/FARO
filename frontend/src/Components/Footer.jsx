import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>
            <div className='bg-dark container-fluid g-0 p-5'>
                <div className="row flex-center flex-column gap-3">
                    {/* <div className="col-md-6 flex-center gap-3">
                        <Link to={'#'} className='bg-white rounded-circle p-2 flex-center'>
                            <ion-icon name="logo-facebook" className="fs-4 text-dark"></ion-icon>
                        </Link>
                        <Link to={'#'} className='bg-white rounded-circle p-2 flex-center'>
                            <ion-icon name="logo-instagram" className="fs-4 text-dark"></ion-icon>
                        </Link>
                        <Link to={'#'} className='bg-white rounded-circle p-2 flex-center'>
                            <ion-icon name="logo-twitter" className="fs-4 text-dark"></ion-icon>
                        </Link>
                        <Link to={'#'} className='bg-white rounded-circle p-2 flex-center'>
                            <ion-icon name="logo-linkedin" className="fs-4 text-dark"></ion-icon>
                        </Link>
                        <Link to={'#'} className='bg-white rounded-circle p-2 flex-center'>
                            <ion-icon name="logo-youtube" className="fs-4 text-dark"></ion-icon>
                        </Link>
                    </div> */}
                    <div className="col-md-6 flex-jcenter gap-3">
                        <Link to={'/'} className='text-decoration-none text-white'>Home</Link>
                        <Link to={'/contact'} className='text-decoration-none text-white'>Contact Us</Link>
                        <Link to={'/events'} className='text-decoration-none text-white'>Events</Link>
                    </div>
                </div>
            </div>

            <div className="container-fluid flex-center bg-black py-2">
                <p className='text-white'>CopyRight ©2025 Designed by TARN</p>
            </div>
        </>
    )
}

export default Footer
