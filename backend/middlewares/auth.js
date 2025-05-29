import jwt from 'jsonwebtoken';

//Middleware function to check the JWT
const auth = (req, res, next) => {
    //get the token from headers
    const token = req.headers.authorization;

    //return if the token is not provided.
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {

        //decode the token data with secret key
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        //Modify req and set userId with decoded user id
        req.userId = decodedData.id;
        //Modify req and set password with decoded user password
        req.password = decodedData.password;
        //Modify req and set email with decoded user email
        req.email = decodedData.email;
        //proceed to the next function
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired. Please login again.' });
        } else {
            return res.status(401).json({ error: 'Invalid token.' });
        }

    }
}

export default auth;