import React, { createContext, useState, useContext } from 'react';

const UploadContext = createContext();

export const useUploadContext = () => useContext(UploadContext);

export const UploadProvider = ({ children }) => {
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [uploadCount, setUploadCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <UploadContext.Provider value={{ uploadStatus, setUploadStatus, uploadCount, setUploadCount, isUploading, setIsUploading }}>
            {children}
        </UploadContext.Provider>
    );
};
