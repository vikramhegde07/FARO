import transporter from "../config/mail.js";

export const sendConfirmationMail = async({ to, name, event }) => {
    const mailOptions = {
        from: 'Event Team <info@faroport.tech>',
        to: to,
        subject: `You're Registered for ${event.name}`,
        html: `
      <h3>Hi ${name},</h3>
      <p>Thank you for registering for <strong>${event.name}</strong>.</p>
      <p>Event Date: ${event.date}</p>
      <p>Location: ${event.location}</p>
      <p>We look forward to seeing you!</p>
      <br/>
      <p>Regards,<br/>Event Team</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};