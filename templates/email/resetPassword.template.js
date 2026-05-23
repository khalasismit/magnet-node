const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

export const getResetPasswordTemplate = (userName, email, token) => {
    const safeUserName = escapeHtml(userName);
    const safeEmail = escapeHtml(email);
    const safeToken = escapeHtml(token);

    return '<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">' +
        '<h4 style="color: #333;">Hello ' + safeUserName + ',</h4>' +
        '<p style="color: #666;">Somebody requested a new password for the magnet account associated with ' + safeEmail + '.</p>' +
        '<p style="color: #666;">No changes have been made to your account yet.</p>' +
        '<p style="color: #666;">You can reset your password by clicking the link below:</p>' +
        '<a href="http://localhost:3000/reset-password/' + safeToken + '" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">http://localhost:3000/reset-password/' + safeToken + '</a>' +
        '<p style="color: #666;">If you did not request a new password, please let us know immediately by replying to this email.</p>' +
        '<div style="margin-top: 20px; color: #999;">' +
            '<p>Yours,</p>' +
            '<p>The Team at Magnet</p>' +
        '</div>' +
    '</div>';
};
