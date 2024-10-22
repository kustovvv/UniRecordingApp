import { Modal, ActivityIndicator, TouchableOpacity, View, Text, TextInput } from 'react-native'
import { styles } from '../../../styles/RecordingPageStyles';

const ActionModal = ({ modalVisible, setModalVisible, modalPosition, closeModals, handleDeleteFile }) => {
    if (!modalVisible) return null;

    return(
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
            >
                <View style={{ ...styles.modal, top: modalPosition.top, left: modalPosition.left }}>
                    <TouchableOpacity onPress={handleDeleteFile}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => closeModals()}>
                        <Text>Rename</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const RenameModal = ({ isRenameModalVisible, setIsRenameModalVisible, handleTextInputChange, newFileName, renameFile, errorMessage }) => {
    return (
        <Modal
            visible={isRenameModalVisible}
            onRequestClose={() => setIsRenameModalVisible(false)}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.ranameModalText}>Renaming an audio recording</Text>
                    <TextInput
                        style={[styles.textInputStyle, errorMessage ? styles.errorInput : null]}
                        onChangeText={(text) => handleTextInputChange(text)}
                        value={newFileName}
                        placeholder="Enter new file name"
                    />
                    {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setIsRenameModalVisible(false)}
                        >
                            <Text style={{ color: 'black'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.renameButton]}
                            onPress={renameFile}
                        >
                            <Text style={styles.buttonText}>Rename</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const LoadingModal = ({ isRegistering }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={isRegistering}
            onRequestClose={() => {}}>
            <View style={styles.centeredView}>
                <View style={styles.loadingModalView}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.modalText}>Please wait...</Text>
                </View>
            </View>
        </Modal>
    )
}


export { ActionModal, RenameModal, LoadingModal }