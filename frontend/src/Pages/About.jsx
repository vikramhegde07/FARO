import React from 'react'

function About() {
    return (
        <>
            <div id='about' className='bg-light'>
                <div className="container-fluid p-5">
                    <div className="row flex-center gap-2">
                        <div className="col-md-3 about-frame">
                            <img src="/assets/img/about.jpg" alt="" className="img-fluid" />
                        </div>
                        <div className="col-md-6 p-2">
                            <h1 className='fs-large'>ABOUT <b className='text-secondary fw-normal'> US</b></h1>
                            <p> We are Computer Software Industry grey heads bring trying to gether more experts and exponents. We intend to pool in the knoweldge, use cases and practical touch points in every faucet.</p>
                            <br />
                            <p> At FARO, we specialize in delivering innovative and reliable software solutions that empower businesses to stay ahead in an ever-evolving digital landscape. With a passionate team of skilled developers, architects, and engineers, we are committed to transforming your ideas into high-performance, scalable, and secure software products.</p>
                            <br />
                            <p> We take pride in understanding the unique challenges that each of our clients faces. By combining cutting-edge technology with industry best practices, we craft tailored solutions that drive efficiency, foster growth, and deliver measurable results. Whether you're looking to build a new product, modernize legacy systems, or improve your business operations, we have the expertise to help you succeed.</p>
                            <br />
                            <p> Our approach is collaborative, transparent, and client-focused, ensuring that we work hand-in-hand with your team throughout every stage of the development process. From initial consultation to post-launch support, we are here to guide you through the complexities of software development, always keeping your goals at the forefront. </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About
