const nodemailer = require('nodemailer');

const sendEmail = async (emails, subject, html) => {
    const recipientEmailIds = emails.join(","); 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'inshabano000000@gmail.com',
            pass: 'fxfisqlqrmusglws', 
        },
    });

    const mailDetails = { 
        from: 'inshabano000000@gmail.com',
        to: recipientEmailIds,
        subject: subject,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailDetails);
        console.log(`Email sent successfully to: ${recipientEmailIds}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email to ${recipientEmailIds}:`, error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;