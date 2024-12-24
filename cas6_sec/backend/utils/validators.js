const sanitizeHtml = require('sanitize-html');

// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Validate password strength
exports.isStrongPassword = (password) => {
    // Ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Sanitize HTML content
exports.sanitizeContent = (content) => {
    return sanitizeHtml(content, {
        allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'br'],
        allowedAttributes: {
            'a': ['href', 'title']
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
};

// Validate file type
exports.isAllowedFileType = (mimetype) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    return allowedTypes.includes(mimetype);
};

// Validate file size
exports.isValidFileSize = (size) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return size <= maxSize;
};

// Validate username format
exports.isValidUsername = (username) => {
    // Chỉ cho phép chữ cái, số, dấu gạch dưới và dấu chấm
    const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;
    return usernameRegex.test(username);
};

// Validate title length and content
exports.isValidTitle = (title) => {
    const sanitizedTitle = title.trim();
    return sanitizedTitle.length >= 1 && sanitizedTitle.length <= 200;
};

// Validate description length
exports.isValidDescription = (description) => {
    const sanitizedDesc = sanitizeHtml(description).trim();
    return sanitizedDesc.length >= 1 && sanitizedDesc.length <= 5000;
};

// Validate comment length
exports.isValidComment = (comment) => {
    const sanitizedComment = sanitizeHtml(comment).trim();
    return sanitizedComment.length >= 1 && sanitizedComment.length <= 1000;
};

// XSS Prevention function
exports.preventXSS = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// SQL Injection prevention by escaping special characters
exports.escapeSQLChars = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent, and double/single quotes
            }
        });
};