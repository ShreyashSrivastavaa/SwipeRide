// // services/otpService.js

// const nodemailer = require('nodemailer');

// // Function to generate OTP
// const generateOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };

// // Configure email transporter
// const emailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Function to send OTP via email
// const sendOtpEmail = async (email, otp) => {
//     const mailOptions = {
//         from: `"Freedom Support" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Freedom Account Verification - OTP Code',
//         html: `
// <!DOCTYPE html>
// <html>
// <head>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             color: #333;
//             background-color: #f4f4f4;
//             margin: 0;
//             padding: 0;
//         }
//         .container {
//             width: 100%;
//             max-width: 600px;
//             margin: 30px auto;
//             padding: 20px;
//             border-radius: 8px;
//             background-color: #ffffff;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }
//         .header {
//             text-align: center;
//             padding-bottom: 20px;
//             border-bottom: 1px solid #e0e0e0;
//         }
//         .header img {
//             max-width: 120px;
//         }
//         .content {
//             padding: 20px 0;
//             text-align: center;
//         }
//         .otp-box {
//             font-size: 24px;
//             font-weight: bold;
//             color: #007bff;
//             padding: 15px;
//             background-color: #f0f8ff;
//             margin: 20px auto;
//             width: fit-content;
//             border-radius: 5px;
//         }
//         .footer {
//             margin-top: 20px;
//             font-size: 12px;
//             color: #777;
//             text-align: center;
//             border-top: 1px solid #e0e0e0;
//             padding-top: 20px;
//         }
//         a {
//             color: #007bff;
//             text-decoration: none;
//         }
//         a:hover {
//             text-decoration: underline;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ89bRRkHLhgwb_wsOLVCVaUoJijX_6ynhDXg&s" alt="Freedom Logo">
//         </div>
//         <div class="content">
//             <p>Dear Valued User,</p>
//             <p>Welcome to <strong>Freedom</strong>! To complete your registration, please use the One-Time Password (OTP) below:</p>
//             <div class="otp-box">${otp}</div>
//             <p>This code is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
//             <p>Thank you for choosing Freedom!</p>
//             <p>Best regards,<br>The Freedom Team</p>
//         </div>
//         <div class="footer">
//             <p>Need assistance? Contact our <a href="mailto:support@freedom.com">Support Team</a>.</p>
//             <p>© 2024 Freedom, All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>
//         `,
//     };

//     try {
//         await emailTransporter.sendMail(mailOptions);
//         console.log('OTP email sent successfully to', email);
//     } catch (error) {
//         console.error('Error sending OTP email:', error);
//         throw new Error('Failed to send OTP email. Please try again later.');
//     }
// };

// module.exports = { generateOtp, sendOtpEmail };
