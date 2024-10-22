import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray',
        paddingTop: 10,
        paddingBottom: 10,
    },
    navItem: {
        padding: 10,
        position: 'absolute',
        left: 0,
    },
    navTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    fileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    fileInfo: {
        flexDirection: 'column',
    },
    noRecordingsText: {
        fontSize: 18,
        color: 'grey',
        textAlign: 'center',
        marginTop: 50, // Adjust the value as needed for your design
    },
    logoutButton: {
        backgroundColor: '#D3D3D3',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: 'black',
        fontSize: 16,
    },
    modal: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    ranameModalText: {
        color: 'black',
        textAlign: 'center',
        marginBottom: 10
    },
    modalView: {
        width: '80%',
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
    },
    textInputStyle: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'white',
        backgroundColor: 'red',
        padding: 0,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    renameButton: {
        backgroundColor: '#007bff',
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
    loadingModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginTop: 15,
        textAlign: "center"
    },
    viewBarWrapper: {
        marginTop: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    audioWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    times: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
    }
});