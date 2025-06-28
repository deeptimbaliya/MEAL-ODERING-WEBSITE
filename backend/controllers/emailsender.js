const nodemailer = require('nodemailer');

const sendOrderEmail = async (toEmail, messageText,subject) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASS        
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: messageText
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
};

module.exports = sendOrderEmail;