import React, { createContext, useState, useContext } from 'react';

const RecordContext = createContext();

export const useRecordContext = () => useContext(RecordContext);

export const RecordProvider = ({ children }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState('00:00:00');
    const [isStartRecording, setIsStartRecording] = useState(false);

    return (
        <RecordContext.Provider value={{ isRecording, setIsRecording, recordingTime, setRecordingTime, isStartRecording, setIsStartRecording }}>
            {children}
        </RecordContext.Provider>
    )
}