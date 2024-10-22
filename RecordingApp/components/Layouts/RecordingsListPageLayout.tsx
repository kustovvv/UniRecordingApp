import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Dimensions } from 'react-native'
import { styles } from '../../styles/RecordingPageStyles';
import Icon from "react-native-vector-icons/FontAwesome5";
import Slider from '@react-native-community/slider';

const RecordingsListScroll = ({ audioFiles, currentlyPlaying, isPlaying, onStartPlay, onStopPlay, setIsPlaying, setCurrentlyPlaying,
                    setSelectedFile, setModalPosition, setModalVisible, setNewFileName, formatDate, handleLongPress,
                    onPlayPress, audioRecorderPlayer, currentPositionSec, setCurrentPositionSec, playTime, setPlayTime,
                    selectedFileIndex, setSelectedFileIndex }) => {

    const [currentDurationSec, setCurrentDurationSec] = useState(0);
    const [duration, setDuration] = useState('00:00');
    const screenWidth = Dimensions.get('screen').width;
    const [barWidth, setBarWidth] = useState(0);

    var playWidth = currentDurationSec === 0 ? 0 : (currentPositionSec / currentDurationSec) * (screenWidth - 56);

    const onStatusPress = (e) => {
        const touchX = e.nativeEvent.locationX;
        const ratio = touchX / barWidth;
        const newPositionSec = ratio * currentDurationSec;
        audioRecorderPlayer.seekToPlayer(newPositionSec);
    };

    const handleFilePress = (index, file) => {
        if (selectedFileIndex !== index) {
            setSelectedFileIndex(index);
        }
        onPlayPress(
            file,
            currentlyPlaying,
            isPlaying,
            onStartPlay,
            onStopPlay,
            setIsPlaying,
            setCurrentlyPlaying,
            setCurrentPositionSec,
            setCurrentDurationSec,
            setPlayTime,
            setDuration,
        );
    };

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 15 }}>
            {audioFiles.map((file, index) => (
                <View key={file.path} style={styles.audioWrapper}>
                    <TouchableOpacity
                        key={index}
                        style={styles.fileRow}
                        onPress={() => handleFilePress(index, file)}
                        onLongPress={(event) =>
                        handleLongPress(file, event, setSelectedFile, setModalPosition, setModalVisible, setNewFileName, setIsPlaying,
                        audioRecorderPlayer)}
                    >
                    <View style={styles.fileInfo}>
                        <Text style={{ color: 'black', fontSize: 18 }}>{file.name.replace('.mp4', '')}</Text>
                        <Text style={{ color: 'grey', fontSize: 15 }}>{formatDate(new Date(file.mtime))}</Text>
                    </View>
                    <Icon
                        name={currentlyPlaying === file.path && isPlaying? 'pause-circle' : 'play-circle'}
                        size={25}
                        color={currentlyPlaying === file.path && isPlaying? 'red' : 'black'}
                    />
                    </TouchableOpacity>
                    {selectedFileIndex === index && (
                        <View style={{ marginBottom: 10 }}>
                            <Slider
                                style={{ width: "100%", height: 30 }}
                                minimumValue={0}
                                maximumValue={currentDurationSec}
                                value={currentPositionSec}
                                onValueChange={value => {
                                    setPlayTime(audioRecorderPlayer.mmssss(Math.floor(value)))
                                }}
                                onSlidingStart={() => {
                                }}
                                onSlidingComplete={value => {
                                    console.log(`value: ${value}`)
                                    setCurrentPositionSec(value);
                                    audioRecorderPlayer.seekToPlayer(value);

                                }}
                                minimumTrackTintColor="black"
                                maximumTrackTintColor="#ccc"
                            />
                            <View style={styles.times}>
                                <Text>{playTime}</Text>
                                <Text>{duration}</Text>
                            </View>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    )
}


export { RecordingsListScroll }