import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { styles } from '../styles/RegisterPageStyles';
import DeviceInfo from 'react-native-device-info';

import { LoginForm } from '../components/Forms/LoginForm'
import { ForgotPasswordButton, LoginButton, RegisterButton } from '../components/Buttons/LoginPageButtons';
import { LoadingModal } from '../components/Utilities/Modals/Modals';

const handleLogin = async (email, password, handleMenuClick, setIsRegistering) => {
    const loginEndpoint = 'http://192.168.1.101:5000/login'
    const uniqueId = await DeviceInfo.getUniqueId();
    setIsRegistering(true);

    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                device_uid: uniqueId,
            }),
        });
        setIsRegistering(false);
        const json = await response.json();

        if (response.status === 200) {
            console.log('Login success:', json);
            handleMenuClick('record');
        } else if (response.status === 401){
            Alert.alert('Login Failed', 'Incorrect email or password, please try again.');
        } else if (response.status === 400){
            Alert.alert('Login Failed', 'Please confirm your email or register again.')
        }
    } catch (error) {
        console.error('Login request error:', error);
    }
}

const LoginPage = ({ handleMenuClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const validateFields = () => {
        let valid = true;

        // Clear previous errors
        setEmailError('');
        setPasswordError('');

        if (!email.trim()) {
            setEmailError('Email has left blank!');
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError('Password has left blank!');
            valid = false;
        }

        if (valid) {
            handleLogin(email, password, handleMenuClick, setIsRegistering);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Log Into Your Account</Text>
            <LoginForm
                emailError={emailError}
                setEmail={setEmail}
                email={email}
                passwordError={passwordError}
                setPassword={setPassword}
                password={password}
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
            >
            </LoginForm>

            <ForgotPasswordButton handleMenuClick={handleMenuClick}></ForgotPasswordButton>

            <View style={styles.leftAlignedContainer}>
                <LoginButton validateFields={validateFields}></LoginButton>
                <RegisterButton handleMenuClick={handleMenuClick}></RegisterButton>
            </View>

            <LoadingModal isRegistering={isRegistering}></LoadingModal>
        </View>
    );
}

export default LoginPage;
