import { TouchableOpacity, Text, View } from 'react-native'
import { styles } from '../../styles/RegisterPageStyles';


const ConfirmButton = ({ validateFields }) => {
    return (
        <View style={styles.leftAlignedContainer}>
            <TouchableOpacity style={styles.signUpButton} onPress={validateFields}>
                <Text style={styles.loginButtonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    )
}


export { ConfirmButton }