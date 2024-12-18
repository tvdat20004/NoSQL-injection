import React, { useState } from 'react';
import './DocumentModal.css';

const DocumentModal = ({ document, onClose }) => {
    const [credentials, setCredentials] = useState({
        userId: '',
        accessPattern: '',
        accessKey: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [processingTime, setProcessingTime] = useState(null);
    const [verifiedDocument, setVerifiedDocument] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isSaving, setIsSaving] = useState(false); 
    const [userRole, setUserRole] = useState('user');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startTime = performance.now();
        setError('');
    
        try {
            console.log('Sending credentials:', credentials);
    
            const response = await fetch('http://localhost:8800/api/vulnerable/case5/verify-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
    
            const data = await response.json();
            setProcessingTime(performance.now() - startTime);
    
            console.log('Server response:', data);
    
            if (!data.success) {
                setError(data.message);
            } else {
                setSuccess('Access granted');
                setVerifiedDocument(data.document);
                setUserPermissions(data.userAccess?.permissions || []);
                setEditedContent(data.document.content);
                setUserRole(data.userAccess?.role);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to verify credentials');
        }
    };

    const handleEdit = async () => {
        // Reset error and success messages
        setError('');
        setSuccess('');
        
        // Validate content
        if (!editedContent.trim()) {
            setError('Content cannot be empty');
            return;
        }

        // Set saving state
        setIsSaving(true);

        try {
            const response = await fetch(`http://localhost:8800/api/vulnerable/case5/document/${document._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: credentials.userId,
                    content: editedContent
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setSuccess('Document updated successfully');
                setVerifiedDocument({
                    ...verifiedDocument,
                    content: editedContent
                });
                setIsEditing(false);
            } else {
                setError(data.message || 'Failed to update document');
            }
        } catch (err) {
            setError('Failed to update document');
            console.error('Error updating document:', err);
        } finally {
            // Reset saving state regardless of outcome
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                const response = await fetch(`http://localhost:8800/api/vulnerable/case5/document/${document._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: credentials.userId
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setSuccess('Document deleted successfully');
                    onClose();
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to delete document');
            }
        }
    };

    // Thêm hàm để update role
    const handleUpdateRole = async () => {
        try {
            const response = await fetch('http://localhost:8800/api/vulnerable/case5/update-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentId: document._id,
                    userId: credentials.userId,
                    targetUserId: credentials.userId, 
                    newRole: 'admin',
                    newPermissions: ['read', 'write', 'delete']
                })
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Permissions updated successfully');
                setUserRole('admin');
                setUserPermissions(['read', 'write', 'delete']);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update permissions');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{document.title}</h2>
                
                {!verifiedDocument ? (
                    <div className="verify-form">
                        <h3>Verify Your Credentials</h3>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        {processingTime && (
                            <div className="timing-info">
                                Request processed in: {processingTime.toFixed(2)}ms
                            </div>
                        )}
    
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>User ID:</label>
                                <input
                                    type="text"
                                    value={credentials.userId}
                                    onChange={(e) => setCredentials({
                                        ...credentials,
                                        userId: e.target.value
                                    })}
                                    required
                                    placeholder="Enter your user ID"
                                />
                            </div>
    
                            <div className="form-group">
                                <label>Access Pattern:</label>
                                <input
                                    type="text"
                                    value={credentials.accessPattern}
                                    onChange={(e) => setCredentials({
                                        ...credentials,
                                        accessPattern: e.target.value
                                    })}
                                    required
                                    placeholder="Enter access pattern"
                                />
                            </div>
    
                            <div className="form-group">
                                <label>Access Key:</label>
                                <input
                                    type="password"
                                    value={credentials.accessKey}
                                    onChange={(e) => setCredentials({
                                        ...credentials,
                                        accessKey: e.target.value
                                    })}
                                    required
                                    placeholder="Enter access key"
                                />
                            </div>
    
                            <div className="button-group">
                                <button type="submit">Verify Access</button>
                                <button type="button" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="document-view">
                        <div className="document-info">
                            <p>Access Level: {document.accessLevel}</p>
                            <p>Tags: {document.metadata?.tags.join(', ')}</p>
                            <p>Current Role: {userRole || 'user'}</p>
                            <p>Permissions: {userPermissions.join(', ')}</p>
                        </div>
    
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
    
                        <div className="document-actions">
                            <button 
                                onClick={handleUpdateRole}
                                disabled={userRole !== 'admin'}
                                className={`permission-button ${userRole !== 'admin' ? 'disabled' : ''}`}
                            >
                                Change Permission
                            </button>
                            {userPermissions.includes('write') && (
                                <button onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel Edit' : 'Edit'}
                                </button>
                            )}
                            {userPermissions.includes('delete') && (
                                <button onClick={handleDelete} className="delete-button">
                                    Delete
                                </button>
                            )}
                        </div>
    
                        <div className="document-content">
                            {isEditing ? (
                                <div className="edit-section">
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleEdit} 
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <div className="content-section">
                                    <p>{verifiedDocument.content}</p>
                                </div>
                            )}
                        </div>
    
                        <button onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentModal;