import { TouchableOpacity, Text } from 'react-native'
import { styles } from '../../styles/RecordingPageStyles';

const LogOutButton = ({ handleLogout }) => {
    return (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
    )
}

export { LogOutButton }