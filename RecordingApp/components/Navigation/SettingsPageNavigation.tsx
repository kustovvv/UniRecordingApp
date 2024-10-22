import { View, TouchableOpacity, Text } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { styles } from '../../styles/RecordingPageStyles';

const SettingsNavbar = ({ handleMenuClick }) => {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => handleMenuClick('record')} style={styles.navItem}>
                <Icon name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Settings</Text>
            <View style={styles.navItem} />
        </View>
    )
}

export { SettingsNavbar }