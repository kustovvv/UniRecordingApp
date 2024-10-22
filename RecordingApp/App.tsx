import React, { useState, useEffect } from 'react';
import { View, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecordingPage from "./pages/RecordingPage";
import RecordingsListPage from "./pages/RecordingsListPage";
import SettingsPage from "./pages/SettingsPage";
import RecoveryPage from "./pages/RecoveryPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import LoadingPage from "./pages/LoadingPage";

import { UploadProvider } from './contexts/UploadContext';
import { RecordProvider } from './contexts/RecordContext';
import { LoginProvider } from './contexts/LoginContext';
import { useLoginContext } from './contexts/LoginContext';

const validateToken = async (setEmail, token, handleMenuClick) => {
    try {
        const response = await fetch('http://10.0.2.2:5000/validate_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const json = await response.json();
        console.log('response: ', response)

        if (response.ok) {
            setEmail(json.email);
            handleMenuClick('password_recovery');
        } else {
            console.log('Token validation error:2', json.error);
        }
    } catch (error) {
        console.log('Token validation error1:', error);
    }
};

const getQueryParams = (url) => {
    const params = {};
    const queryString = url.split('?')[1];
    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }
    return params;
};


const App = () => {
    const [menuSelection, setMenuSelection] = useState('recording');
    const [email, setEmail] = useState('');
    const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = useLoginContext();

    const checkUserLogin = async () => {
        try {
            const checkLoginEndpoint = 'http://192.168.1.101:5000/check_login';
            const uniqueId = await DeviceInfo.getUniqueId();
            const response = await fetch(checkLoginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ device_uid: uniqueId }),
            });

            if (response.status === 200) {
                const json = await response.json();
                console.log('response: ', json);
                return true;
            } if (response.status === 201) {
                const json = await response.json();
                console.log('response: ', json);
                return false;
            }
        } catch (error) {
            console.error('Token validation error1:', error);
            return false;
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            checkUserLogin().then(loginStatus => {
                setTimeout(() => {
                    setIsLoggedIn(loginStatus);
                    setIsLoading(false);
                }, 1000);
            })
        }
    }, [])

    const handleMenuClick = (menuOption) => {
        setMenuSelection(menuOption);
    }

    useEffect(() => {
        const handleOpenURL = (event) => {
            const url = event.url;
            const queryParams = getQueryParams(url);
            if (queryParams.token) {
                validateToken(setEmail, queryParams.token, handleMenuClick);
            }
        };

        Linking.getInitialURL().then(url => {
            if (url) handleOpenURL({url});
        });
        Linking.addEventListener('url', handleOpenURL);

        return () => {
            try {
                Linking.removeEventListener('url', handleOpenURL);
            } catch (e) {}
        };
    }, []);

    if (isLoading) {
        return <LoadingPage />;
    }

    let content;
    switch (menuSelection) {
        case 'recordingList':
            content = <RecordingsListPage handleMenuClick={handleMenuClick} />;
            break;
        case 'record':
            content = <RecordingPage handleMenuClick={handleMenuClick} />;
            break;
        case 'register':
            content = <RegisterPage handleMenuClick={handleMenuClick} />;
            break;
        case 'login':
            content = <LoginPage handleMenuClick={handleMenuClick} />;
            break;
        case 'settings':
            content = <SettingsPage handleMenuClick={handleMenuClick} />;
            break;
        case 'recovery':
            content = <RecoveryPage handleMenuClick={handleMenuClick} />;
            break;
        case 'password_recovery':
            content = <PasswordRecoveryPage email={email} handleMenuClick={handleMenuClick} />;
            break;
        default:
            content = isLoggedIn ?
                <RecordingPage handleMenuClick={handleMenuClick} /> :
                <LoginPage handleMenuClick={handleMenuClick} />;
            break;
    }

    return (
        <RecordProvider>
            <UploadProvider>
                <View style={{ flex: 1 }}>
                    {content}
                </View>
            </UploadProvider>
        </RecordProvider>
    )
}

const Root = () => {
    return (
        <LoginProvider>
            <App />
        </LoginProvider>
    );
}

export default Root;