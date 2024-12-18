const express = require('express');
const router = express.Router();
const Document = require('../../vulnerable/timingAttack/Document');
const { compareSecurely } = require('../../../utils/security');
const { checkRole } = require('../../../middleware/roleCheck');
const { authLimiter } = require('../../../middleware/rateLimiter');

router.get('/list', async (req, res) => {
    try {
        const documents = await Document.find({}, {
            title: 1,
            accessLevel: 1,
            'metadata.tags': 1
        });

        res.json({
            success: true,
            documents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching documents'
        });
    }
});

router.post('/verify-access', authLimiter, async (req, res) => {
    try {
        const { userId, accessPattern } = req.body;

        // Find document without revealing existence
        const document = await Document.findOne({
            'authorizedUsers.userId': userId
        });

        if (!document) {
            return res.status(403).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const authorizedUser = document.authorizedUsers.find(user => 
            user.userId === userId
        );

        // Use constant-time comparison
        const isValidPattern = compareSecurely(
            accessPattern,
            document.securityConfig.accessPattern
        );

        if (!isValidPattern) {
            return res.status(403).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Return minimal information
        return res.json({
            success: true,
            message: 'Access granted',
            document: {
                _id: document._id,
                title: document.title,
                content: document.content
            },
            userAccess: {
                userId: authorizedUser.userId,
                role: authorizedUser.role,
                permissions: authorizedUser.permissions
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update role route with proper checks
router.post('/update-role', 
    authLimiter,
    checkRole('admin'),
    async (req, res) => {
        try {
            const { targetUserId, newRole, newPermissions } = req.body;
            const document = req.document;

            if (newRole === 'admin' && req.authorizedUser.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot assign admin role'
                });
            }

            const validPermissions = ['read', 'write', 'delete'];
            if (!newPermissions.every(p => validPermissions.includes(p))) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid permissions'
                });
            }

            await Document.updateOne(
                { 
                    _id: document._id,
                    'authorizedUsers.userId': targetUserId
                },
                {
                    $set: {
                        'authorizedUsers.$.role': newRole,
                        'authorizedUsers.$.permissions': newPermissions
                    }
                }
            );

            res.json({
                success: true,
                message: 'Role updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

// Other routes...
module.exports = router;