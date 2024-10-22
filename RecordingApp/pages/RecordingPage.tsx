import React, { useState, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from "react-native-vector-icons/FontAwesome5";

import checkPermissions from '../permissions';
import { styles } from './styles/RecordingPageStyles';
import removeAllAudioFiles from '../utilities'
import { useUploadContext } from '../contexts/UploadContext';
import { useRecordContext } from '../contexts/RecordContext';
import { SettingsButton, RecordListButton, RecordButton, BottomButtons } from '../components/Buttons/RecordingPageButtons';


const audioRecorderPlayer = new AudioRecorderPlayer();

const getNewPath = async () => {
    try {
        const path = `${RNFS.DocumentDirectoryPath}/`;
        const files = await RNFS.readDir(path);
        const recordPattern = /^New record (\d+)\.mp4$/;
        let maxNumber = 0;
        const numbers = new Set();

        files.forEach((file) => {
            const match = file.name.match(recordPattern);
            if (match) {
                const num = parseInt(match[1], 10);
                numbers.add(num);
                maxNumber = Math.max(maxNumber, num);
            }
        });

        let nextNumber = 1;
        for (; nextNumber <= maxNumber; nextNumber++) {
            if (!numbers.has(nextNumber)) {
                break;
            }
        }

        // This accounts for the case where all numbers up to maxNumber are taken
        if (nextNumber > maxNumber) {
            nextNumber = maxNumber + 1;
        }

        const filename = `New record ${nextNumber}.mp4`;
        console.log('2')
        return `${path}${filename}`;
    } catch (error) {
        console.error('Error generating new path', error);
        return null; // or handle accordingly
    }
};

const formatTime = (millisec) => {
    const seconds = Math.floor((millisec / 1000) % 60);
    const minutes = Math.floor((millisec / (1000 * 60)) % 60);
    const hours = Math.floor((millisec / (1000 * 60 * 60)) % 24);

    const hoursStr = (hours < 10) ? `0${hours}` : `${hours}`;
    const minutesStr = (minutes < 10) ? `0${minutes}` : `${minutes}`;
    const secondsStr = (seconds < 10) ? `0${seconds}` : `${seconds}`;

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const onStartRecord = async (setIsRecording, setRecordingTime, setIsStartRecording) => {
    if (!(await checkPermissions())) {
        return;
    }
    const path = await getNewPath();
    const result = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
        const time = formatTime(e.currentPosition);
        setRecordingTime(time);
    })
    setIsRecording(true);
    setIsStartRecording(true);
}

const onPauseRecord = async (setIsRecording) => {
    await audioRecorderPlayer.pauseRecorder();
    setIsRecording(false);
}

const onResumeRecord = async (setIsRecording) => {
    await audioRecorderPlayer.resumeRecorder();
    setIsRecording(true);
}

const saveAudio = async (setIsRecording, setRecordingTime, setIsStartRecording) => {
    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener();
    console.log('result: ', result);
    setRecordingTime('00:00:00');
    setIsRecording(false);
    setIsStartRecording(false);
}

const RecordingPage = ({ handleMenuClick }) => {
    const { isRecording, setIsRecording, recordingTime, setRecordingTime, isStartRecording, setIsStartRecording } = useRecordContext();
    const { uploadStatus, setUploadStatus, uploadCount, setUploadCount, isUploading, setIsUploading } = useUploadContext();
    return (
        <>
            <View style={{ flex: 0.9, marginTop: 15, marginRight: 15, alignItems: 'flex-end' }}>
                <SettingsButton isStartRecording={isStartRecording} isUploading={isUploading} handleMenuClick={handleMenuClick} />
            </View>
            <View style={{ flex: 1, alignItems: 'center'}}>
                <Text style={{ fontSize: 54 }}>{recordingTime}</Text>
            </View>
            <BottomButtons
                isUploading={isUploading}
                isRecording={isRecording}
                onStartRecord={() => onStartRecord(setIsRecording, setRecordingTime, setIsStartRecording)}
                handleMenuClick={handleMenuClick}
                saveAudio={() => saveAudio(setIsRecording, setRecordingTime, setIsStartRecording)}
                onPauseRecord={() => onPauseRecord(setIsRecording)}
                onResumeRecord={() => onResumeRecord(setIsRecording)}
                isStartRecording={isStartRecording}
            >
            </BottomButtons>
        </>
    )
}

export default RecordingPage;