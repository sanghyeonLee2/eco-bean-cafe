import React, {useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import axios from "axios";
import GoBack from "../../components/Header/GoBack";

const MyReusableCupInfo = () => {
    const clickEventListener = () => {
        Alert.alert('Success', 'Product has beed added to cart')
    }

    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/reusableCup/list`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청 성공:", result.data);
                setReusableCup(result.data)
            } catch (error) {
                // 에러 응답이 있는 경우
                if (error.response) {
                    console.log("요청 실패. 응답 코드:", error.response.status, error.message);
                    console.log("에러 응답 데이터:", error.response.data, error.message);

                    // 여기서 error.response.status를 통해 상태 코드를 확인할 수 있습니다.
                } else if (error.request) {
                    // 요청은 전송되었지만 응답이 없는 경우
                    console.log("요청 실패. 응답이 없음");
                } else {
                    // 요청이 전송조차 되지 않은 경우
                    console.log("요청 실패. 오류 메시지:", error.message, error.message);
                }
            }
        }
        fetchMenuInfo()
    }, [trigger]);

    return (
        <View style={styles.container}>
            <GoBack/>
            <ScrollView>
                <View style={{ alignItems: 'center', marginHorizontal: 30 }}>
                    <Image
                        style={styles.productImg}
                        source={{
                            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3v7KDJN7TAoJa5sFaPWcp1HX8JFcpF3z5K3ngz4L6kWoEP7Ca',
                        }}
                    />
                    <Text style={styles.name}>뿌리등급</Text>
                    <Text style={styles.price}>$ 12.22</Text>
                    <Text style={styles.description}>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                        dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,
                        nascetur ridiculus mus. Donec quam felis, ultricies nec
                    </Text>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.addToCarContainer}>
                    <TouchableOpacity style={styles.shareButton} onPress={() => clickEventListener()}>
                        <Text style={styles.shareButtonText}>Add To Cart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    productImg: {
        width: 200,
        height: 200,
    },
    name: {
        fontSize: 28,
        color: '#696969',
        fontWeight: 'bold',
    },
    price: {
        marginTop: 10,
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    },
    description: {
        textAlign: 'center',
        marginTop: 10,
        color: '#696969',
    },
    btnSize: {
        height: 40,
        width: 40,
        borderRadius: 40,
        borderColor: '#778899',
        borderWidth: 1,
        marginHorizontal: 3,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#00BFFF',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    addToCarContainer: {
        marginHorizontal: 30,
    },
})
export default MyReusableCupInfo