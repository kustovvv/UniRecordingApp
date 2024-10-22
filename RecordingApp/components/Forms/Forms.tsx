import { TextInput, View, TouchableOpacity, Text } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { styles } from '../../styles/RegisterPageStyles';

const EmailInputForm = ({ emailError, setEmail, email }) => {
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
        </>
    )
}

const PasswordsInputForm = ({ password1, password2, passwordError1, setPassword1, passwordError2, setPassword2,
                              passwordVisible, setPasswordVisible }) => {
    return (
        <>
            <View style={styles.inputWithIcon}>
                <TextInput
                    style={[styles.input, passwordError1 ? styles.errorInput : null]}
                    onChangeText={setPassword1}
                    value={password1}
                    placeholder='Enter password'
                    secureTextEntry={!passwordVisible}
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
                    <Icon name={passwordVisible ? 'eye': 'eye-slash'} size={20} color={'gray'} />
                </TouchableOpacity>
            </View>
            {passwordError1 ? <Text style={styles.errorText}>{passwordError1}</Text> : null}
            <View style={styles.inputWithIcon}>
                <TextInput
                    style={[styles.input, passwordError2 ? styles.errorInput : null]}
                    onChangeText={setPassword2}
                    value={password2}
                    placeholder='Repeat password'
                    secureTextEntry={!passwordVisible}
                    autoCapitalize='none'
                />
            </View>
            {passwordError2 ? <Text style={styles.errorText}>{passwordError2}</Text> : null}
        </>
    )
}

export { EmailInputForm, PasswordsInputForm }