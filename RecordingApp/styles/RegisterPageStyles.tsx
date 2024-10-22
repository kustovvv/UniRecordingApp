import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 20
    },
    input: {
        width: '90%',
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 10,
        opacity: 1,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    gapContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkboxLabel: {
        marginLeft: 6,
    },
    forgotPasswordContainer: {
        flex: 1,
    },
    forgotPassword: {
        color: 'blue',
        textAlign: 'right',
    },
    signUpButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '20%',
        marginTop: 20,
    },
    recoveryButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '40%',
        marginTop: 10,
        marginRight: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
    leftAlignedContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
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
    }
});