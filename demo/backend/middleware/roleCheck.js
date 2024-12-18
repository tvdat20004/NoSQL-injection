const Document = require('../routes/vulnerable/timingAttack/Document');

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const { userId } = req.body;
            const document = await Document.findOne({
                'authorizedUsers.userId': userId
            });

            if (!document) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const user = document.authorizedUsers.find(u => u.userId === userId);
            
            if (!user || user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            req.document = document;
            req.authorizedUser = user;
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    };
};

module.exports = { checkRole };