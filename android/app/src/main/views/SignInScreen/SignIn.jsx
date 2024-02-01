import React, {useState} from 'react';

import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    ScrollView
} from 'react-native';
import {isAdminAtom, isLogInAtom, userAtom} from "../../../../../../Store/userState";
import {useAtom, useAtomValue, useSetAtom} from "jotai";


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useAtom(userAtom);
    const setIsLogIn = useSetAtom(isLogInAtom);
    const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)
    const handleLogin = () => {
        if (userInfo.password === password && userInfo.email) {
            setIsLogIn(true)
            Alert.alert(
                "로그인 성공", // Alert 제목
                "로그인에 성공하셨습니다", // Alert 내용
                [
                    {
                        text: "확인",
                        style: "cancel"
                    }
                ]
            );
        } else if (email === "2" && password === "2") {
            setIsLogIn(true)
            setUserInfo({
                userId: "2", password: "2", phoneNumber: "1",
                email: "1", address: "1", point: 1, recommendations: 1,
                reusableUsed: 1, reusableReturned: 1, rating: "gold", admin: false
            })
            Alert.alert(
                "관리자 로그인 성공", // Alert 제목
                "로그인에 성공하셨습니다", // Alert 내용
                [
                    {
                        text: "확인",
                        style: "cancel"
                    }
                ]
            );
        } else if (email === "admin" && password === "1") {
            setIsAdmin(true)
            Alert.alert(
                "관리자 로그인 성공", // Alert 제목
                "로그인에 성공하셨습니다", // Alert 내용
                [
                    {
                        text: "확인",
                        style: "cancel"
                    }
                ]
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("./../../../../../../assets/img/EcoBeanLogo.png")} style={styles.logo}/>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.card}>
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.card}>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E7EEE8',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 160,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 10,
        borderWidth: 3, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        marginTop: 5,
    },
    formContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
        padding: 10,
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#B0C4DE'
    },
    loginButton: {
        backgroundColor: '#7B68EE',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SignIn;