import { View, TouchableOpacity, Text } from 'react-native'
import { styles } from '../../styles/RegisterPageStyles';

const ForgotPasswordButton = ({ handleMenuClick }) => {
    return (
        <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword} onPress={() => handleMenuClick('recovery')}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
    )
}

const LoginButton = ({ validateFields }) => {
    return (
        <TouchableOpacity style={styles.signUpButton} onPress={validateFields}>
            <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
    )
}

const RegisterButton = ({ handleMenuClick }) => {
    return (
        <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity>
                <Text style={styles.registerText} onPress={() => handleMenuClick('register')}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export { ForgotPasswordButton, LoginButton, RegisterButton }