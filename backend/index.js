import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//importing routes
import userRoute from './routes/userRoute.js';
import islasndRoute from './routes/islandRoute.js';
import articleRoute from './routes/articleRoute.js';
import eventsRoute from './routes/eventsRoute.js';
import subscriptionRoute from './routes/subscriptionRoute.js';
import accessRoute from './routes/accessRoute.js';

//configure dotenv
dotenv.config();

//Port for express app to run
const PORT = process.env.PORT

//MongoDB connection URI
const mongoURI = process.env.mongoSecret;

//Express app
const app = express();

//cors policy implementation
app.use(cors());

//Support for json format data
app.use(express.json());

//Route to handle Users
app.use('/user', userRoute);

app.use('/uploads', express.static("uploads/"));

//Route to handle islands
app.use('/island', islasndRoute);

//Route to handle articles
app.use('/article', articleRoute);

//Route to handle articles
app.use('/event', eventsRoute);

//Route to handle subscriptions
app.use('/subscription', subscriptionRoute);

//Route to handle new access requests
app.use('/access', accessRoute);

// connection to mongodb
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('App is connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`App is listening to Port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Error : ${error}`);
    });