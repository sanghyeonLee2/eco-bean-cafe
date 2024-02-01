import { Button, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const GoBack = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Ionicons size={30} name="arrow-back-sharp" onPress={() => navigation.goBack()}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width:"100%",
        backgroundColor: "white"
    },
});

export default GoBack;