import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: '', //smtp server ex: smtp.yourdomail.com
    port: 465, // Secure SSL port
    secure: true, // true for 465, false for 587
    auth: {
        user: "", //your mail@yourdomain.com
        pass: "" //password for the mailbox
    }
});

export default transporter;