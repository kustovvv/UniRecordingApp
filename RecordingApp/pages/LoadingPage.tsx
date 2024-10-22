import React from 'react';
import { View, Image } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";

import { styles } from '../styles/LoadingPageStyles';

const LoadingPage = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../images/newlybooked_logo.jpg')}
                style={styles.image}
            />
        </View>
    )
}

export default LoadingPage;