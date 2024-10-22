import React, { useState } from 'react';
import { View, Modal, ActivityIndicator, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/RegisterPageStyles';
import Icon from "react-native-vector-icons/FontAwesome5";

import { EmailInputForm, PasswordsInputForm } from '../components/Forms/Forms';
import { ConfirmButton } from '../components/Buttons/PasswordRecoveryPageButtons';

const isValidPassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const isValidLength = password.length >= 8;
    return hasNumber && hasLetter && isValidLength;
}

const handleResetPassword = async (email, password, handleMenuClick) => {
    const resetPasswordEndpoint = 'http://10.0.2.2:5000/apply_reset_password'

    try {
        const response = await fetch(resetPasswordEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        const json = await response.json();

        if (response.status === 200) {
            console.log('Password was reset successfully:', json);
            handleMenuClick('login');
            Alert.alert('Success', 'Your password was reset successfully. You can go back and log in again.');
        } else if (response.status === 409){
            Alert.alert('Failed', 'Something went wrong.');
        }
    } catch (error) {
        console.error('Registration request error:', error);
    }
}

const PasswordRecoveryPage = ({ email, handleMenuClick }) => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordError1, setPasswordError1] = useState('');
    const [passwordError2, setPasswordError2] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const validateFields = () => {
        let valid = true;

        // Clear previous errors
        setPasswordError1('');
        setPasswordError2('');

        // Validate Password1
        if (!password1.trim()) {
            setPasswordError1('Password has left blank!');
            valid = false;
            console.log('Password has left blank')
        } else if (!isValidPassword(password1)) {
            console.log('Password must be at least 8 characters long')
            setPasswordError1('Password must be at least 8 characters long, include numbers and letters.');
            valid = false;
        }

        // Validate Password2
        if (!password2.trim()) {
            setPasswordError2('Password has left blank!');
            valid = false;
        } else if (!isValidPassword(password2)) {
            setPasswordError2('Password must be at least 8 characters long, include numbers and letters.');
            valid = false;
        }

        if (password1.trim() && password2.trim() && password1 !== password2) {
            setPasswordError1('Passwords do not match!');
            setPasswordError2('Passwords do not match!');
            valid = false;
        }

        if (valid) {
            handleResetPassword(email, password1, handleMenuClick);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Create New Password</Text>
            <PasswordsInputForm
                password1={password1}
                password2={password2}
                passwordError1={passwordError1}
                setPassword1={setPassword1}
                passwordError2={passwordError2}
                setPassword2={setPassword2}
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
            >
            </PasswordsInputForm>
            <ConfirmButton validateFields={validateFields}></ConfirmButton>
        </View>
    );
}

export default PasswordRecoveryPage;