import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';

import { styles } from '../styles/RecordingPageStyles';
import { SettingsNavbar } from '../components/Navigation/SettingsPageNavigation';
import { LogOutButton } from '../components/Buttons/SettingsPageButtons';
import { LoadingModal } from '../components/Utilities/Modals/Modals';

const handleLogout = async (handleMenuClick, setIsLoggingOut) => {
    try {
        setIsLoggingOut(true);
        const logoutEndpoint = 'http://10.0.2.2:5000/logout';
        const uniqueId = await DeviceInfo.getUniqueId();
        const response = await fetch(logoutEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_uid: uniqueId }),
        });
        setIsLoggingOut(false);

        if (response.status === 200) {
            const json = await response.json();
            console.log('success: ', json);
            handleMenuClick('login');
        } else {
            const json = await response.json();
            console.error('error: ', json);
        }
    } catch (error) {
        console.error('Token validation error1:', error);
    }
};

const SettingsPage = ({ handleMenuClick }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    return (
        <>
            <SettingsNavbar handleMenuClick={handleMenuClick}></SettingsNavbar>
            <LogOutButton handleLogout={() => handleLogout(handleMenuClick, setIsLoggingOut)}></LogOutButton>
            <LoadingModal isRegistering={isLoggingOut} ></LoadingModal>
        </>
    )
}

export default SettingsPage;