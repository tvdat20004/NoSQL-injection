import React, { useState, useEffect } from 'react';
import DocumentModalSecure from '../DocumentModalSecure/DocumentModalSecure';
import './DocumentListSecure.css';

const DocumentListSecure = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://localhost:8800/api/secure/case5/list');
            const data = await response.json();
            
            if (data.success) {
                setDocuments(data.documents);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="document-list-container">
            <h2>Documents List</h2>
            
            {error && (
                <div className="error-message">{error}</div>
            )}

            {loading ? (
                <div className="loading">Loading documents...</div>
            ) : (
                <div className="documents-grid">
                    {documents.map(doc => (
                        <div 
                            key={doc._id}
                            className="document-card"
                            onClick={() => setSelectedDoc(doc)}
                        >
                            <h3>{doc.title}</h3>
                            <div className="document-metadata">
                                <div className="access-level">
                                    Access Level: {doc.accessLevel}
                                </div>
                                <div className="tags">
                                    Tags: {doc.metadata.tags.join(', ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedDoc && (
                <DocumentModalSecure 
                    document={selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                />
            )}
        </div>
    );
};

export default DocumentListSecure;