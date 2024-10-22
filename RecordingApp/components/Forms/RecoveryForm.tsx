import { TextInput, Text } from 'react-native'
import { styles } from '../../styles/RegisterPageStyles';


const RecoveryForm = ({ emailError, setEmail, email }) => {
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

export { RecoveryForm }