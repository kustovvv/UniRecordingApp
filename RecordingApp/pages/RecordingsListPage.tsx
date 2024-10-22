import React, { useState, useEffect } from 'react';
import { Text, Alert, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import qs from 'qs';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { styles } from '../styles/RecordingPageStyles';
import { useUploadContext } from '../contexts/UploadContext';
import { useRecordContext } from '../contexts/RecordContext';
import { RecordingsListNavbar } from '../components/Navigation/RecordingsListPageNavigation';
import { RecordingsListScroll } from '../components/Layouts/RecordingsListPageLayout';
import { UploadToServerButton } from '../components/Buttons/RecordingsListPageButtons';
import { ActionModal, RenameModal } from '../components/Utilities/Modals/Modals';


const audioRecorderPlayer = new AudioRecorderPlayer();

const useAudioFiles = () => {
    const [audioFiles, setAudioFiles] = useState([]);

    const loadAudioFiles = async () => {
        try {
            const path = `${RNFS.DocumentDirectoryPath}/`;
            const files = await RNFS.readDir(path);
            const audioFiles = files.filter((file) => file.isFile() && file.name.endsWith('.mp4'));

            setAudioFiles(audioFiles);
        } catch (error) {
            console.log('Error reading audio files', error);
        }
    };

    useEffect(() => {
        loadAudioFiles();
    }, []);

    return { audioFiles, setAudioFiles, loadAudioFiles };
};

let playbackListener;

const onStartPlay = async (args) => {
    const { path, onStopPlay, setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setCurrentDurationSec,
            setPlayTime, setDuration, setCurrentlyPlaying } = args;
    console.log('start play');
    if (playbackListener) {
        audioRecorderPlayer.removePlayBackListener(playbackListener);
    }
    try {
        onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
        const msg = await audioRecorderPlayer.startPlayer(path);
        const volume = await audioRecorderPlayer.setVolume(1.0);
    } catch (error) {
        console.log('Failed to start playback', error);
    }

    playbackListener = audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

        const currentPos = Math.floor(e.currentPosition);
        const totalDur = Math.floor(e.duration);

        if (currentPos + 700 >= totalDur) {
            console.log(`currentPos >= totalDur: ${currentPos >= totalDur}`)
            onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
        }
    });
    setIsPlaying(true);
}

const onStopPlay = (setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying) => {
    console.log('audio stopped')
    setIsPlaying(false);
    setCurrentPositionSec(0);
    setPlayTime("00:00");
    try {
        setCurrentlyPlaying(null);
        audioRecorderPlayer.stopPlayer();
    } catch (error) {
        console.log('Error occurred while stopping the playback', error);
    }
}

const onPausePlay = async (setIsPlaying, audioRecorderPlayer) => {
    setIsPlaying(false);
    await audioRecorderPlayer.pausePlayer();
};

const onResumePlay = async (setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying) => {
    try {
        await audioRecorderPlayer.resumePlayer();
        setIsPlaying(true);
    } catch (e) {
        console.log('Error resuming player:', e);
        try {
            onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
        } catch (stopError) {
            console.log('Error stopping player:', stopError);
        }
    }
};

const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const onPlayPress = (file, currentlyPlaying, isPlaying, onStartPlay, onStopPlay, setIsPlaying, setCurrentlyPlaying, setCurrentPositionSec,
                   setCurrentDurationSec, setPlayTime, setDuration ) => {
    if (currentlyPlaying && currentlyPlaying !== file.path) {
        onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
    }

    if (currentlyPlaying === file.path) {
        // If the file that's currently playing is pressed, stop it
        if (isPlaying) {
            onPausePlay(setIsPlaying, audioRecorderPlayer); // Pause the player
        } else {
            onResumePlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying); // Resume the player
        }
    } else {
        // Otherwise, start playing the new file
        onStartPlay({
            path: file.path,
            onStopPlay: onStopPlay,
            setIsPlaying: setIsPlaying,
            audioRecorderPlayer: audioRecorderPlayer,
            setCurrentPositionSec: setCurrentPositionSec,
            setCurrentDurationSec: setCurrentDurationSec,
            setPlayTime: setPlayTime,
            setDuration: setDuration,
            setCurrentlyPlaying: setCurrentlyPlaying,
        });
        setCurrentlyPlaying(file.path);
        setIsPlaying(true);
    }
};

const checkAndUpdateFiles = async (setUploadStatus, setUploadCount) => {
    // Fetch server files
    setUploadStatus('Checking server for existing files...');
    const fetchedServerFiles = await handleGetExistingFiles();

    // Load local audio files
    setUploadStatus('Comparing files...');
    const path = `${RNFS.DocumentDirectoryPath}/`;
    const localFiles = await RNFS.readDir(path);
    const audioFiles = localFiles.filter(file => file.isFile() && file.name.endsWith('.mp4'));
    const missing = audioFiles.filter(localFile => !fetchedServerFiles.some(serverFile =>
        new Date(serverFile.appProperties.mtime).getTime() === new Date(localFile.mtime).getTime()
    ));

    setUploadCount(missing.length);
    console.log('missing: ', missing)
    if (missing.length > 0) {
        setUploadStatus(`Sending ${missing.length} new file(s) to the server...`);
        try {
            await handleUploadFiles(missing);
            Alert.alert("Upload Complete", `${missing.length} new file(s) have been uploaded.`);
        } catch (error) {
            console.error('Error during file upload:', error);
            setUploadStatus('Failed to upload files');
        }
    } else {
        Alert.alert("Up to Date", "All files are up to date.");
    }
};

const handleUploadFiles = async (missingFiles) => {
    const formData = new FormData();
    const uniqueId = await DeviceInfo.getUniqueId();
    formData.append('device_uid', uniqueId);
    const mtimes = {};

    for (const audioFile of missingFiles) {
        const chunk = {
           uri: `file://${audioFile.path}`,
           type: "application/octet-stream",
           name: audioFile.name,
        }
        formData.append('audio_files', chunk);
        mtimes[audioFile.name] = audioFile.mtime;
    }

    formData.append('mtimes', JSON.stringify(mtimes));

    const uploadEndpoint = 'http://10.0.2.2:5000/upload_files_to_google_drive';
    await axios.post(uploadEndpoint, formData, {
       headers: {
          "Content-Type": `multipart/form-data`,
       },
    });
};

const handleGetExistingFiles = async () => {
    const getExistingFilesEndpoint = 'http://10.0.2.2:5000/get_existing_files';
    const uniqueId = await DeviceInfo.getUniqueId();
    const response = await fetch(getExistingFilesEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_uid: uniqueId }),
    });

    if (response.status === 200) {
        const json = await response.json();
        return json.files || [];
    } else {
         console.log('Response status:', response.status, 'Status text:', response.statusText);
    }
    return [];
};

const handleUploadButtonClick = async (setUploadStatus, setUploadCount, setIsUploading) => {
    setIsUploading(true);
    try {
        await checkAndUpdateFiles(setUploadStatus, setUploadCount);
    } catch (error) {
        console.error('Error during file upload:', error);
    }
    setIsUploading(false);
};

const handleCallAlert = async(setUploadStatus, setUploadCount, setIsUploading) => {
    Alert.alert(
        "Upload in Progress",
"You won't be able to record audio until the upload is done. The longer the files are, the longer the process will be.",
        [
            { text: "Cancel", onPress: () => {}, style: "cancel" },
            {
                text: "Got it",
                onPress: async () => handleUploadButtonClick(setUploadStatus, setUploadCount, setIsUploading)
            }
        ],
        { cancelable: true,onDismiss: () => {} }
    );
}

const handleLongPress = (file, event, setSelectedFile, setModalPosition, setModalVisible, setNewFileName, setIsPlaying,
    audioRecorderPlayer) => {
    const { pageX, pageY } = event.nativeEvent;
    const screen = Dimensions.get('window');
    const modalOffset = 100;

    const xPosition = (pageX + modalOffset > screen.width) ? screen.width - modalOffset : pageX;
    const yPosition = (pageY + modalOffset > screen.height) ? screen.height - modalOffset : pageY;
    setSelectedFile(file);
    setModalPosition({ top: yPosition, left: xPosition });
    setModalVisible(true);

    const initialFileName = file.name.replace('.mp4', '')
    setNewFileName(initialFileName);
    onPausePlay(setIsPlaying, audioRecorderPlayer);
};

const deleteFile = async (setModalVisible, selectedFile, updateFilesList) => {
    if (selectedFile && selectedFile.path) {
        try {
            const filePath = selectedFile.path;
            const isFile = await RNFS.exists(filePath);

            if (isFile) {
                await RNFS.unlink(filePath);
                console.log(`File deleted: ${filePath}`);
                updateFilesList(filePath);
            } else {
                console.log('File does not exist: ${filePath}');
            }
        } catch (error) {
            console.log('Error deleting file: ', error);
        }
    }
}

const handleDeleteFile = async (setModalVisible, selectedFile, updateFilesList, onStopPlay, setIsPlaying,
                            audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying,
                            setSelectedFileIndex) => {
    if (selectedFile && selectedFile.path && selectedFile.name) {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete "${selectedFile.name.replace('.mp4', '')}"?`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        setSelectedFileIndex(null);
                        onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
                        deleteFile(setModalVisible, selectedFile, updateFilesList);
                    }
                },
            ],
            { cancelable: false }
        );
    } else {
        console.log("No file selected");
    }
    setModalVisible(false);
};

const renameFile = async (setIsRenameModalVisible, newFileName, selectedFile, loadAudioFiles,
                        setErrorMessage, onStopPlay, setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime,
                        setCurrentlyPlaying, setSelectedFileIndex) => {
    if (!newFileName.trim()) {
        setErrorMessage('The file name cannot be empty.');
        return;
    }
    if (newFileName === selectedFile.name.replace('.mp4', '')) {
        setSelectedFileIndex(null);
        onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
        setIsRenameModalVisible(false);
        return;
    }
    const newFilePath = selectedFile.path.replace(/[^/]*$/, newFileName + '.mp4');
    const fileExists = await RNFS.exists(newFilePath);
    if (fileExists) {
        setErrorMessage('A file with that name already exists.');
        return;
    }
    try {
        setSelectedFileIndex(null);
        onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying);
        await RNFS.moveFile(selectedFile.path, newFilePath);
        console.log(`File renamed to: ${newFileName}`);
        loadAudioFiles();
        setIsRenameModalVisible(false);
        setErrorMessage("");
    } catch (error) {
        setErrorMessage('There was an error renaming the file.');
    }
}

const RecordingListContent = ({ handleMenuClick }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const { audioFiles, setAudioFiles, loadAudioFiles, missingFiles } = useAudioFiles();
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const { isRecording, setIsRecording, recordingTime, setRecordingTime } = useRecordContext();
    const { isUploading, setIsUploading, uploadStatus, setUploadStatus, uploadCount, setUploadCount } = useUploadContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPositionSec, setCurrentPositionSec] = useState(0);
    const [playTime, setPlayTime] = useState('00:00');
    const [selectedFileIndex, setSelectedFileIndex] = useState(null);

    const updateFilesList = (deletedFilePath) => {
        setAudioFiles(currentFiles => {
            return currentFiles.filter(file => file.path !== deletedFilePath);
        });
    }

    const closeModals = () => {
        setIsRenameModalVisible(true);
        setModalVisible(false);
    }

    const handleTextInputChange = (text) => {
        setNewFileName(text);
        setErrorMessage("");
    }

    return (
        <>
            <RecordingsListNavbar
                handleMenuClick={handleMenuClick}
                onStopPlay={() => onStopPlay(setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying)}
            >
            </RecordingsListNavbar>
            {audioFiles.length === 0 ? (
                <Text style={styles.noRecordingsText}>You don't have any recordings.</Text>
            ) : (
            <>
                <RecordingsListScroll
                    audioFiles={audioFiles}
                    currentlyPlaying={currentlyPlaying}
                    isPlaying={isPlaying}
                    onStartPlay={onStartPlay}
                    onStopPlay={onStopPlay}
                    setIsPlaying={setIsPlaying}
                    setCurrentlyPlaying={setCurrentlyPlaying}
                    setSelectedFile={setSelectedFile}
                    setModalPosition={setModalPosition}
                    setModalVisible={setModalVisible}
                    setNewFileName={setNewFileName}
                    formatDate={formatDate}
                    handleLongPress={handleLongPress}
                    onPlayPress={onPlayPress}
                    audioRecorderPlayer={audioRecorderPlayer}
                    currentPositionSec={currentPositionSec}
                    setCurrentPositionSec={setCurrentPositionSec}
                    playTime={playTime}
                    setPlayTime={setPlayTime}
                    selectedFileIndex={selectedFileIndex}
                    setSelectedFileIndex={setSelectedFileIndex}
                >
                </RecordingsListScroll>

                <ActionModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    modalPosition={modalPosition}
                    closeModals={closeModals}
                    handleDeleteFile={() => handleDeleteFile(setModalVisible, selectedFile, updateFilesList, onStopPlay,
                        setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime, setCurrentlyPlaying,
                        setSelectedFileIndex)
                    }
                />

                <RenameModal
                    isRenameModalVisible={isRenameModalVisible}
                    setIsRenameModalVisible={setIsRenameModalVisible}
                    handleTextInputChange={handleTextInputChange}
                    newFileName={newFileName}
                    errorMessage={errorMessage}
                    renameFile={() => renameFile(setIsRenameModalVisible, newFileName, selectedFile, loadAudioFiles,
                        setErrorMessage, onStopPlay, setIsPlaying, audioRecorderPlayer, setCurrentPositionSec, setPlayTime,
                        setCurrentlyPlaying, setSelectedFileIndex)
                    }
                >
                </RenameModal>

                <UploadToServerButton
                    handleCallAlert={() => handleCallAlert(setUploadStatus, setUploadCount, setIsUploading)}
                    isUploading={isUploading}
                    uploadStatus={uploadStatus}
                >
                </UploadToServerButton>
            </>
            )}
        </>
    )
}

export default RecordingListContent;