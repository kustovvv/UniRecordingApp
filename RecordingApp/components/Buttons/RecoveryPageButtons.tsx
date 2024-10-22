import { TouchableOpacity, Text } from 'react-native'
import { styles } from '../../styles/RegisterPageStyles';


const ResetPasswordButton = ({ validateFields }) => {
    return (
        <TouchableOpacity style={styles.recoveryButton} onPress={validateFields}>
            <Text style={styles.loginButtonText}>Reset password</Text>
        </TouchableOpacity>
    )
}

const BackButton = ({ handleMenuClick }) => {
    return (
        <TouchableOpacity
            style={[styles.recoveryButton, { backgroundColor: 'gray' }]}
            onPress={() => handleMenuClick('login')}
        >
            <Text style={styles.loginButtonText}>Back</Text>
        </TouchableOpacity>
    )
}

export { ResetPasswordButton, BackButton }