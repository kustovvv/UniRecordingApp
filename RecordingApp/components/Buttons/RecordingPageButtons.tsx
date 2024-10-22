import { TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";


const RecordButton = ({ isUploading, isRecording, onPress }) => {
    const iconName = isRecording ? 'pause-circle' : 'dot-circle';
    const buttonStyle = isUploading ? { opacity: 0.5 } : {};

    return (
        <TouchableOpacity onPress={onPress} disabled={isUploading} style={buttonStyle}>
            <Icon name={iconName} size={50} color={'red'} />
        </TouchableOpacity>
    );
};

const SaveButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name={'check-circle'} size={50} color={'black'} />
        </TouchableOpacity>
    )
}

const RecordListButton = ({ isRecording, onPress }) => {
    const buttonStyle = isRecording ? { opacity: 0.5 } : {};
    return (
        <TouchableOpacity onPress={onPress} disabled={isRecording} style={buttonStyle}>
            <Icon name={'bars'} size={50} color={'black'} />
        </TouchableOpacity>
    )
}

const SettingsButton = ({ isStartRecording, isUploading, handleMenuClick }) => {
    const isDisabled = isStartRecording || isUploading ? true : false;
    const buttonStyle = isStartRecording || isUploading ? { opacity: 0.5 } : {};
    return (
        <TouchableOpacity disabled={isDisabled} style={buttonStyle} onPress={() => handleMenuClick('settings')}>
            <Icon name={'cog'} size={50} color={'black'} />
        </TouchableOpacity>
    )
}

const BottomButtons = ({ isUploading, isRecording, onStartRecord, handleMenuClick, saveAudio, onPauseRecord,
    onResumeRecord, isStartRecording }) => {
    return (
        <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}></View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RecordButton
                    isUploading={isUploading}
                    isRecording={isRecording}
                    onPress={isStartRecording ? isRecording ? onPauseRecord : onResumeRecord : onStartRecord}
                />
            </View>
            <View style={{ flex: 1, marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
                {isStartRecording ? (
                    <SaveButton onPress={() => saveAudio()}/>
                ) : (
                    <RecordListButton isRecording={isRecording} onPress={() => handleMenuClick('recordingList')}/>
                )}
            </View>
        </View>
    )
}

export { RecordButton, RecordListButton, SettingsButton, BottomButtons }