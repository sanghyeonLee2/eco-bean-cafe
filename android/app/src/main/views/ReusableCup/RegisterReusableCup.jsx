import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import {useNavigation} from "@react-navigation/native";

export default function RegisterReusableCup() {
    const navigation = useNavigation()
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcodeData, setBarcodeData] = useState("");
/*
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);*/

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarcodeData(data);
        setScanned && navigation.navigate("나의 리유저블컵",{data});
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <View style={styles.buttonContainer}>
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        backgroundColor: 'white',
        padding: 10,
    },
});