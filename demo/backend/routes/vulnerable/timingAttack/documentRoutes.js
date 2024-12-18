const express = require('express');
const router = express.Router();
const Document = require('./Document');


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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

router.post('/verify-access', async (req, res) => {
    const startTime = process.hrtime();
    
    try {
        const { userId, accessPattern, role } = req.body;

        // Tìm document và user được authorized
        const document = await Document.findOne({
            'authorizedUsers.userId': userId
        });

        if (!document) {
            const endTime = process.hrtime(startTime);
            return res.status(403).json({
                success: false,
                message: 'Access denied: User not found',
                processingTime: endTime[1] / 1000000
            });
        }

        // Tìm user trong document
        const authorizedUser = document.authorizedUsers.find(user => 
            user.userId === userId
        );

        // Thêm phần validate độ dài accessPattern
        if (document.securityConfig.accessPattern.length !== accessPattern.length) {
            const endTime = process.hrtime(startTime);
            return res.status(403).json({
                success: false,
                message: 'Access denied: Invalid access pattern',
                processingTime: endTime[1] / 1000000
            });
        }

        // Check từng ký tự của accessPattern với delay
        let isValidPattern = true;
        for(let i = 0; i < accessPattern.length; i++) {
            await sleep(100); // Thêm delay cho mỗi ký tự
            if(document.securityConfig.accessPattern[i] !== accessPattern[i]) {
                isValidPattern = false;
                break;
            }
        }

        if (!isValidPattern) {
            const endTime = process.hrtime(startTime);
            return res.status(403).json({
                success: false,
                message: 'Access denied: Invalid access pattern',
                processingTime: endTime[1] / 1000000
            });
        }

        // Log access
        document.metadata.lastAccessed.push(new Date());
        await document.save();
        
        if (role) {
            authorizedUser.role = role;
            authorizedUser.permissions = ['read', 'write', 'delete'];
            await document.save();
        }

        // Return success
        const endTime = process.hrtime(startTime);
        return res.json({
            success: true,
            message: 'Access granted',
            processingTime: endTime[1] / 1000000,
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
        console.error('Verify access error:', error);
        const endTime = process.hrtime(startTime);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            processingTime: endTime[1] / 1000000
        });
    }
});

router.post('/update-role', async (req, res) => {
    try {
        const { documentId, userId, targetUserId, newRole, newPermissions } = req.body;
        
        const document = await Document.findById(documentId);
        if (document) {
            await Document.updateOne(
                { _id: documentId, 'authorizedUsers.userId': targetUserId },
                {
                    $set: {
                        'authorizedUsers.$.role': newRole,
                        'authorizedUsers.$.permissions': newPermissions
                    }
                }
            );
            return res.json({ success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Thêm routes cho các thao tác CRUD
router.get('/document/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const document = await Document.findOne({
            _id: id,
            'authorizedUsers.userId': userId,
            'authorizedUsers.permissions': 'read'
        });

        if (!document) {
            return res.status(403).json({
                success: false,
                message: 'Access denied or document not found'
            });
        }

        res.json({
            success: true,
            document
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.put('/document/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;

        const document = await Document.findOne({
            _id: id,
            'authorizedUsers.userId': userId,
            'authorizedUsers.permissions': 'write'
        });

        if (!document) {
            return res.status(403).json({
                success: false,
                message: 'Access denied or document not found'
            });
        }

        document.content = content;
        await document.save();

        res.json({
            success: true,
            message: 'Document updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.delete('/document/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const document = await Document.findOne({
            _id: id,
            'authorizedUsers.userId': userId,
            'authorizedUsers.permissions': 'delete'
        });

        if (!document) {
            return res.status(403).json({
                success: false,
                message: 'Access denied or document not found'
            });
        }

        await Document.deleteOne({ _id: id });

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Access document với flags size vulnerability
router.post('/access-document', async (req, res) => {
    try {
        const { documentId, userId, accessKey, permissions } = req.body;

        // Vulnerable to permission manipulation
        const document = await Document.findOneAndUpdate(
            {
                _id: documentId,
                'authorizedUsers': {
                    $elemMatch: {
                        userId: userId,
                        accessKey: accessKey
                    }
                }
            },
            {
                $set: {
                    'authorizedUsers.$[user].permissions': permissions || ['read']
                }
            },
            {
                arrayFilters: [{ 'user.userId': userId }],
                new: true
            }
        );

        if (!document) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Invalid credentials'
            });
        }

        return res.json({
            success: true,
            document: {
                title: document.title,
                content: document.content,
                metadata: document.metadata,
                userAccess: {
                    userId: userId,
                    permissions: document.authorizedUsers.find(user => user.userId === userId).permissions
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Test timing route
router.post('/test-timing', async (req, res) => {
    const { pattern, length } = req.body;
    const startTime = process.hrtime();

    try {
        await sleep(50); // Base delay
        
        if (pattern && pattern.length === length) {
            await sleep(20); // Additional delay for correct length
        }

        const endTime = process.hrtime(startTime);
        
        res.json({
            success: true,
            processingTime: endTime[1] / 1000000
        });
    } catch (error) {
        const endTime = process.hrtime(startTime);
        res.status(500).json({
            success: false,
            processingTime: endTime[1] / 1000000
        });
    }
});

module.exports = router;