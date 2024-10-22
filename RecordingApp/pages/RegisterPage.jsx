import React, { useState } from 'react';
import { View, Modal, ActivityIndicator, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';

import { styles } from '../styles/RegisterPageStyles';
import { EmailInputForm, PasswordsInputForm } from '../components/Forms/Forms';
import { SignUpButton, LoginButton } from '../components/Buttons/RegisterPageButtons';
import { LoadingModal } from '../components/Utilities/Modals/Modals';

const isValidPassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const isValidLength = password.length >= 8;
    return hasNumber && hasLetter && isValidLength;
}

const handleRegistration = async (email, password, handleMenuClick, setIsRegistering) => {
    const signupEndpoint = 'http://10.0.2.2:5000/signup'

    try {
        setIsRegistering(true);
        const response = await fetch(signupEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        setIsRegistering(false);

        const json = await response.json();

        if (response.status === 200) {
            console.log('Registration success:', json);
            handleMenuClick('login');
            Alert.alert('Confirm your email', 'We have sent you a confirmation by email, please click on the link provided in the message.');
        } else if (response.status === 409){
            Alert.alert('Registration Failed', 'A user with this email already exists.');
        }
    } catch (error) {
        console.error('Registration request error:', error);
    }
}

const RegisterPage = ({ handleMenuClick }) => {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError1, setPasswordError1] = useState('');
    const [passwordError2, setPasswordError2] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const validateFields = () => {
        let valid = true;

        // Clear previous errors
        setEmailError('');
        setPasswordError1('');
        setPasswordError2('');

        if (!email.trim()) {
            setEmailError('Email has left blank!');
            valid = false;
        }
        // Validate Password1
        if (!password1.trim()) {
            setPasswordError1('Password has left blank!');
            valid = false;
        } else if (!isValidPassword(password1)) {
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
            console.log('Email:', email, 'Password1:', password1, 'Password2:', password1);
            handleRegistration(email, password1, handleMenuClick, setIsRegistering);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Create Your Account</Text>
            <EmailInputForm setEmail={setEmail} email={email} emailError={emailError}></EmailInputForm>
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

            <View style={styles.leftAlignedContainer}>
                <SignUpButton validateFields={validateFields}></SignUpButton>
                <LoginButton handleMenuClick={handleMenuClick}></LoginButton>
            </View>

            <LoadingModal isRegistering={isRegistering} ></LoadingModal>
        </View>
    );
}

export default RegisterPage;