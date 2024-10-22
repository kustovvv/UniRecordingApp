import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

const openSettings = () => {
    Linking.openSettings().catch(() => Alert.alert('Cannot open settings'));
};

const checkAndRequestPermissions = async () => {
    const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ];

    const rationale = {
        title: "Microphone Permission",
        message: "This app needs access to your microphone to record audio.",
    };

    try {
        const granted = await PermissionsAndroid.requestMultiple(permissions, rationale);
        console.log('Permissions', granted);
        const deniedPermissions = permissions.filter(permission => granted[permission] !== PermissionsAndroid.RESULTS.GRANTED);

        if (deniedPermissions.length > 0) {
            Alert.alert(
                "Permission Denied",
                "Some permissions were denied. You can enable them in app settings.",
                [{text: "Open Settings", onPress: openSettings}, {text: "Cancel"}],
                {cancelable: true},
            )
            return false
        }

        console.log('Permissions granted');
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

export default checkAndRequestPermissions;