const express = require('express');
const router = express.Router();
const User = require('./User');

router.post('/login', async (req, res) => {
    try {
        const query = req.body;
        const user = await User.findOne({ username: query.username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Handle $where injection
        if (query.$where) {
            try {
                const funcBody = query.$where.match(/function\s*\(\s*\)\s*\{([\s\S]*)\}/)[1];
                const userObj = user.toObject();

                // Case 0: Default case - check all special cases first,
                // if none match then return Account locked
                let isSpecialCase = false;

                const indexLengthMatch = funcBody.match(/Object\.keys\(this\)\[(\d+)\]\.length\s*==\s*(\d+)/);
                if (indexLengthMatch) {
                    isSpecialCase = true;
                    const index = parseInt(indexLengthMatch[1]);
                    const testLength = parseInt(indexLengthMatch[2]);
                    
                    if (index >= Object.keys(userObj).length) {
                        return res.status(500).json({
                            success: false,
                            message: 'Internal server error: index out of bounds'
                        });
                    }

                    const fieldName = Object.keys(userObj)[index];
                    if (fieldName.length === testLength) {
                        return res.status(403).json({
                            success: false,
                            message: 'Account locked; please reset your password'
                        });
                    }

                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                const indexMatchTest = funcBody.match(/Object\.keys\(this\)\[(\d+)\]\.match\('(\^[^']+)'\)/);
                if (indexMatchTest) {
                    isSpecialCase = true;
                    const index = parseInt(indexMatchTest[1]);
                    const testPattern = indexMatchTest[2];
                    
                    if (index >= Object.keys(userObj).length) {
                        return res.status(500).json({
                            success: false,
                            message: 'Internal server error: index out of bounds'
                        });
                    }

                    const fieldName = Object.keys(userObj)[index];
                    console.log('Testing field:', fieldName, 'with pattern:', testPattern); 

                    const patternWithoutCaret = testPattern.slice(1);
                    if (fieldName.startsWith(patternWithoutCaret)) {
                        return res.status(403).json({
                            success: false,
                            message: 'Account locked; please reset your password'
                        });
                    }

                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                const tokenLengthMatch = funcBody.match(/this\.resetToken\.length\s*==\s*(\d+)/) || 
                                       funcBody.match(/this\[(\d+)\]\.length\s*==\s*(\d+)/);
                if (tokenLengthMatch) {
                    isSpecialCase = true;
                    const testLength = parseInt(tokenLengthMatch[1]);
                    if (tokenLengthMatch[2]) { 
                        const index = parseInt(tokenLengthMatch[1]);
                        const testLength = parseInt(tokenLengthMatch[2]);
                        
                        if (index >= Object.keys(userObj).length) {
                            return res.status(500).json({
                                success: false,
                                message: 'Internal server error: index out of bounds'
                            });
                        }

                        const fieldValue = Object.values(userObj)[index];
                        if (fieldValue?.length === testLength) {
                            return res.status(403).json({
                                success: false,
                                message: 'Account locked; please reset your password'
                            });
                        }
                    } else { 
                        if (userObj.resetToken?.length === testLength) {
                            return res.status(403).json({
                                success: false,
                                message: 'Account locked; please reset your password'
                            });
                        }
                    }

                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                // Case 4: Testing resetToken value characters 
                const tokenValueMatch = funcBody.match(/this\.resetToken\.match\('(\^[^']+)'\)/) ||
                                      funcBody.match(/this\[(\d+)\]\.match\('(\^[^']+)'\)/);
                if (tokenValueMatch) {
                    isSpecialCase = true;
                    if (tokenValueMatch[2]) { 
                        const index = parseInt(tokenValueMatch[1]);
                        const testPattern = tokenValueMatch[2];
                        
                        if (index >= Object.keys(userObj).length) {
                            return res.status(500).json({
                                success: false,
                                message: 'Internal server error: index out of bounds'
                            });
                        }

                        const fieldValue = Object.values(userObj)[index];
                        const patternWithoutCaret = testPattern.slice(1);
                        
                        if (typeof fieldValue === 'string' && fieldValue.startsWith(patternWithoutCaret)) {
                            return res.status(403).json({
                                success: false,
                                message: 'Account locked; please reset your password'
                            });
                        }
                    } else { 
                        const testPattern = tokenValueMatch[1];
                        const patternWithoutCaret = testPattern.slice(1);
                        
                        if (userObj.resetToken?.startsWith(patternWithoutCaret)) {
                            return res.status(403).json({
                                success: false,
                                message: 'Account locked; please reset your password'
                            });
                        }
                    }

                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                // Case 5: Catch all other $where queries
                const isUsingResetToken = funcBody.includes('resetToken');
                if (isUsingResetToken) {
                    return res.status(403).json({
                        success: false,
                        message: 'Account locked; please reset your password'
                    });
                }

                // If no special cases matched, return Account locked
                if (!isSpecialCase) {
                    return res.status(403).json({
                        success: false,
                        message: 'Account locked; please reset your password'
                    });
                }

                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });

            } catch (error) {
                console.error('$where execution error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error: ' + error.message
                });
            }
        }

        // Handle $ne operator
        if (query.password && typeof query.password === 'object' && query.password.$ne !== undefined) {
            return res.status(403).json({
                success: false,
                message: 'Account locked; please reset your password'
            });
        }

        // Normal login check
        if (query.password === user.password) {
            return res.json({
                success: true,
                message: 'Login successful'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
});


router.get('/forgot-password', async (req, res) => {
    try {
        const { username, resetToken } = req.query;

        // Nếu có cả username và resetToken, kiểm tra tính hợp lệ
        if (username && resetToken) {
            const user = await User.findOne({ 
                username: username,
                resetToken: resetToken 
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid username or token'
                });
            }

            // Nếu token và username hợp lệ, redirect tới trang reset password
            return res.redirect(`http://localhost:3000/test/extract-unknowfield/vulnerable/reset-password?username=${username}&token=${resetToken}`);
        }

        // Nếu không có params hoặc chỉ có một trong hai, trả về trang forgot password
        return res.status(200).json({
            success: true,
            message: 'Please enter your username to reset password'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
});

// Route xử lý forgot password request
router.post('/forgot-password', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Tìm user và trả về thông báo chung để tránh username enumeration
        const user = await User.findOne({ username });

        return res.json({
            success: true,
            message: 'If an account exists with that username, a password reset link will be sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
router.post('/verify-token', async (req, res) => {
    try {
        const { username, resetToken } = req.body;

        if (!username || !resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Username and reset token are required'
            });
        }

        // Tìm user với username và resetToken tương ứng
        const user = await User.findOne({
            username,
            resetToken
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token or username'
            });
        }

        return res.json({
            success: true,
            message: 'Token verified successfully'
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { username, token, newPassword } = req.body;

        // Validate input
        if (!username || !token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Tìm user với username và resetToken tương ứng
        const user = await User.findOne({
            username: username,
            resetToken: token
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token or username'
            });
        }

        // Cập nhật password
        user.password = newPassword;
        // Tạo resetToken mới
        user.resetToken = Math.random().toString(36).substr(2, 12);
        // Mở khóa account
        user.accountLocked = false;

        await user.save();

        return res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while resetting password'
        });
    }
});

module.exports = router;