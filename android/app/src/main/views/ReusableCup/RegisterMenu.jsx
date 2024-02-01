import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {useNavigation, useRoute} from "@react-navigation/native";
import axios from 'axios';
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState";
import {triggerAtom} from "../../../../../../Store/triggerState";
import GoBack from "../../components/Header/GoBack";


const RegisterMenu = ({route}) => {
    const [trigger, setTrigger] = useAtom(triggerAtom)
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedTemperature, setSelectedTemperature] = useState("hot");
    const [isSubscriptionOrder, setSubscriptionOrder] = useState(false);
    const [menuSelect, setMenuSelect] = useState("")
    const [userInfo, setUserInfo] = useAtom(userAtom)
    const {reusableId} = route.params;

    const [menu, setMenu] = useState([])
    const navigation = useNavigation();
    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/subscription/orderReusable`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청 성공:", result.data);
                console.log("요청 성공:", result?.data.subscriptionReusableOrderForms);
                setMenu(result?.data.subscriptionReusableOrderForms)
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
    }, []);
    console.log(menuSelect)
    const register = async () => {
        const obj = {
            menuId: menuSelect,
            reusableId,
            selectedTemperature,
        }
        // Set the selected menu ID


        closeBottomSheet();
        // Make a POST request to your server
        try {
            const response = await axios.post(`http://${process.env.API_URL2}:8080/reusableCup/menuRegistration`, obj);

            // Handle the response as needed
            console.log('Server  response:', response.data);

            // Show the confirmation alert
            Alert.alert('알림', '메뉴 등 록    이 완료되었습니다', [
                {
                    text: '확인',
                    onPress: () => {
                        // Navigate back to the previous screen
                        setTrigger(!trigger)
                        navigation.navigate("나의 리유저블컵", {data: menuSelect});
                    },
                },
            ]);
        } catch (error) {
            console.error('Error making POST request:', error);
            // Handle errors
        }
    }

    const renderProductItem = ({item}) => (
            <View style={styles.productCard}>
                <Image source={require("./../../../../../../assets/img/0.png")} style={styles.productImage}/>
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>메뉴이름 : {item?.menuReusableOrderForm?.menuName}</Text>
                    <Text style={styles.productDescription}>구독주문 가능 여부
                        : {item?.menuReusableOrderForm?.subscriptionAvailableMenu ? <>가능</> : <>불가능</>}</Text>
                    <Text style={styles.productPrice}>{item?.menuReusableOrderForm.menuPrice}원</Text>
                </View>
                <Text style={{color: 'white'}}>상세정보</Text>
                <TouchableOpacity
                    style={styles.orderBtn}
                    onPress={() => {
                        console.log(item.menuReusableOrderForm.menuId, ">?:")
                        setMenuSelect(item.menuReusableOrderForm.menuId)
                        setBottomSheetVisible(true);
                    }}
                >
                    <Text style={{color: 'white'}}>등록하기</Text>
                </TouchableOpacity>
            </View>
        )
    ;

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };
    return (
        <View style={styles.container}>
            <GoBack/>
            <FlatList
                data={menu}
                style={styles.productList}
                renderItem={renderProductItem}
                keyExtractor={(item) => item?.menuReusableOrderForm.menuId}
                contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 100}}
            />

            {/* Bottom Sheet */}
            <Modal
                isVisible={isBottomSheetVisible}
                onBackdropPress={closeBottomSheet}
                onBackButtonPress={closeBottomSheet}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={{margin: 0, justifyContent: 'flex-end'}}
            >
                <View style={styles.bottomSheet}>
                    <View style={styles.handle}/>
                    {/* Content of your bottom sheet */}
                    <Text>온도</Text>
                    <View style={styles.temperatureButtons}>
                        <TouchableOpacity
                            style={[styles.temperatureButton, selectedTemperature === 'hot' && styles.selectedButton]}
                            onPress={() => setSelectedTemperature('hot')}
                        >
                            <Text style={styles.buttonText}>HOT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.temperatureButton, selectedTemperature === 'ice' && styles.selectedButton]}
                            onPress={() => setSelectedTemperature('ice')}
                        >
                            <Text style={styles.buttonText}>ICE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.subscriptionCheckbox}>
                        <Text>구독 주문여부</Text>
                        <TouchableOpacity onPress={() => setSubscriptionOrder(!isSubscriptionOrder)}>
                            <View style={[styles.checkbox, isSubscriptionOrder && styles.checkedCheckbox]}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={register}>
                        <Text style={{color: 'white'}}>확인</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    productList: {
        flex: 1,
        paddingTop: 16,
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        padding: 16,
        marginBottom: 16,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    productPriceText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666',
    },
    orderBtn: {
        borderRadius: 5,
        backgroundColor: '#0fa958',
        width: 80,
        paddingTop: 7,
        paddingLeft: 15,
        height: 35,
        marginHorizontal: 8,
    },
    actions: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    bottomSheet: {
        height: "35%",
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    handle: {
        backgroundColor: '#ccc',
        height: 6,
        width: 40,
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 16
    },
    temperatureButtons: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    temperatureButton: {
        marginHorizontal: 1,
        marginVertical: 8,
        backgroundColor: '#eee',
        paddingVertical: 13,
        paddingHorizontal: 20,
        width: "45%",
        height: 50,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: "gray"
    },
    selectedButton: {
        backgroundColor: '#0fa958',
    },
    buttonText: {
        textAlign: "center",
    },
    subscriptionCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#000',
        marginLeft: 8,
    },
    checkedCheckbox: {
        backgroundColor: '#0fa958',
    },
    confirmButton: {
        backgroundColor: '#092A19',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: "80%",
        marginTop: 16,
    },
});

export default RegisterMenu;
