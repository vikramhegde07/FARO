import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: "info@faroport.tech",
        pass: "Dx78PctdhYb+"
    }
});

export default transporter;