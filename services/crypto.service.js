import crypto from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

export const encryptMessage = (message) => {
    if (!message) return '';
    return crypto.AES.encrypt(message, process.env.SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage) => {
    if (!encryptedMessage) return '';
    const bytes = crypto.AES.decrypt(encryptedMessage, process.env.SECRET_KEY);
    if (bytes.sigBytes > 0) {
        return bytes.toString(crypto.enc.Utf8);
    }
    return '';
};
