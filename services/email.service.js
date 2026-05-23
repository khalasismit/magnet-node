import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create the transporter once
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};
