import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { styles } from '../styles/RegisterPageStyles';

import { RecoveryForm } from '../components/Forms/RecoveryForm'
import { ResetPasswordButton, BackButton } from '../components/Buttons/RecoveryPageButtons';
import { LoadingModal } from '../components/Utilities/Modals/Modals';

const handleSendEmail = async (email, setIsRegistering) => {
    const recoveryEndpoint = 'http://10.0.2.2:5000/recovery'

    try {
        setIsRegistering(true);
        const response = await fetch(recoveryEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        setIsRegistering(false);

        const json = await response.json();

        if (response.status === 200) {
            console.log('Email has been sent:', json);
            Alert.alert('Confirm your email', 'We have sent you a password reset email, please click on the link provided in the email.');
        } else if (response.status === 401) {
            console.log("There is no user with this email", json)
            Alert.alert("Check that your email is correct", "We did not find a user with this email.")
        }
    } catch (error) {
        console.error('Sending email error:', error);
    }
}

const RecoveryPage = ({ handleMenuClick }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const validateFields = () => {
        let valid = true;
        setEmailError('');

        if (!email.trim()) {
            setEmailError('Email has left blank!');
            valid = false;
        }
        if (valid) {
            handleSendEmail(email, setIsRegistering);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Forgot your password?</Text>
            <Text>Please enter your email address and we will send a password reset link to your email.</Text>

            <RecoveryForm emailError={emailError} setEmail={setEmail} email={email}></RecoveryForm>

            <View style={styles.leftAlignedContainer}>
                <View style={styles.gapContainer}>
                    <ResetPasswordButton validateFields={validateFields}></ResetPasswordButton>
                    <BackButton handleMenuClick={handleMenuClick}></BackButton>
                </View>
            </View>

            <LoadingModal isRegistering={isRegistering}></LoadingModal>
        </View>
    );
}

export default RecoveryPage;