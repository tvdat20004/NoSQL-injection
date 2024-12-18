// const { hasOperators, sanitizeInput } = require('../utils/validation');

// const preventNoSQLInjection = (req, res, next) => {
//     // Kiểm tra body request
//     if (hasOperators(req.body)) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Invalid input detected' 
//         });
//     }

//     // Kiểm tra query parameters
//     if (hasOperators(req.query)) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Invalid query parameters' 
//         });
//     }

//     // Sanitize input
//     req.body = sanitizeInput(req.body);
//     req.query = sanitizeInput(req.query);

//     next();
// };

// module.exports = {
//     preventNoSQLInjection
// };