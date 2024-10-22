import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import { styles } from '../styles/RecordingPageStyles';

const UploadToServerButton = ({ handleCallAlert, isUploading, uploadStatus }) => {
    return (
        <TouchableOpacity
            onPress={handleCallAlert}
            disabled={isUploading}
            style={{
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'white',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 0,
                alignItems: 'center',
                opacity: isUploading ? 0.5 : 1,
            }}
        >
            {isUploading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', marginRight: 10 }}>
                        {uploadStatus}
                    </Text>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            ) : (
                <Text style={{ color: 'black' }}>Upload files to server</Text>
            )}
        </TouchableOpacity>
    )
}

export { UploadToServerButton }