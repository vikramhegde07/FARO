import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; //import dotenv
dotenv.config(); //configure dotenv

const transporter = nodemailer.createTransport({
    host: '', //smtp server ex: smtp.yourdomail.com
    port: 465, // Secure SSL port
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.MAIL_USER, //your mail@yourdomain.com from .env
        pass: process.env.MAIL_PASS //password for the mailbox from .env
    }
});

export default transporter;