import { TextInput, View, TouchableOpacity, Text } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { styles } from '../../styles/RegisterPageStyles';

const LoginForm = ({ emailError, setEmail, email, passwordError, setPassword, password, passwordVisible, setPasswordVisible }) => {
    return (
        <>
            <TextInput
                style={[styles.input, emailError ? styles.errorInput : null]}
                onChangeText={setEmail}
                value={email}
                placeholder='Enter a valid email address'
                keyboardType='email-address'
                autoCapitalize='none'
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <View style={styles.inputWithIcon}>
                <TextInput
                    style={[styles.input, passwordError ? styles.errorInput : null]}
                    onChangeText={setPassword}
                    value={password}
                    placeholder='Enter password'
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
                    <Icon name={passwordVisible ? 'eye': 'eye-slash'} size={20} color={'gray'} />
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </>
    )
}

export { LoginForm }