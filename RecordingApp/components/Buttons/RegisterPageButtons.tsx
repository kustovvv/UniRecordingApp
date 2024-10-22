import { TouchableOpacity, Text, View } from 'react-native'
import { styles } from '../../styles/RegisterPageStyles';

const SignUpButton = ({ validateFields }) => {
    return (
        <TouchableOpacity style={styles.signUpButton} onPress={validateFields}>
            <Text style={styles.loginButtonText}>Sign up</Text>
        </TouchableOpacity>
    )
}

const LoginButton = ({ handleMenuClick }) => {
    return (
        <View style={styles.registerContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity>
                <Text style={styles.registerText} onPress={() => handleMenuClick('login')}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export { SignUpButton, LoginButton }