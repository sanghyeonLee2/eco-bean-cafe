import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    Switch,
    TouchableOpacity,
    Alert, // Alert 추가
} from 'react-native';
import axios from "axios";
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState";
import {useRoute} from "@react-navigation/native";
import GoBack from "../../components/Header/GoBack";

const MyCouponScreen = ({navigation}) => {
    const route = useRoute()
    const {selectedOption, packagePrice, packageName, packageId} = route?.params
    const [userInfo, setUserInfo] = useAtom(userAtom)
    const [coupon, setCoupon] = useState({})
    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/coupon`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청    성공:", result.data);
                setCoupon(result.data, "asdsd")
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
    }, [userInfo]);

    const [isEnabled, setIsEnabled] = useState(false);
    const [buttonASelected, setButtonASelected] = useState(true);
    const [buttonBSelected, setButtonBSelected] = useState(false);

    const handleButtonATouch = () => {
        setButtonASelected(!buttonASelected);
        setButtonBSelected(false);
    };

    const handleButtonBTouch = () => {
        setButtonBSelected(!buttonBSelected);
        setButtonASelected(false);
    };
    const handleFlatListItemPress = (item) => {
        console.log(item.couponId, "asds")
        // FlatList의 각 항목을 눌렀을 때 동작할 로직 추가
        Alert.alert(
            '확인',
            `사용하시겠습니까? ${item.discountDetails}`,
            [
                {
                    text: '취소',
                    onPress: () => console.log('취소 Pressed'),
                    style: 'cancel',
                },
                {
                    text: '확인',
                    onPress: () => {
                        // 확인을 눌렀을 때의 로직 추가
                        // 이전 화면으로 돌아가도록 navigation.goBack() 호출
                        navigation.navigate('패키지 결제하기', {
                            couponId: item.couponId,
                            selectedOption, packagePrice, packageName, packageId
                            // 다른 필요한 파라미터들도 추가 가능
                        });
                    },
                },
            ],
            {cancelable: false}
        );
    };

    return (
        <>
            <GoBack/>
            <Text style={{fontSize:25,fontWeight:"bold",padding:10,}}>쿠폰 선택</Text>
            {buttonASelected ? (
                <View style={styles.container}>
                    <FlatList
                        data={coupon}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => handleFlatListItemPress(item)}>
                                <View style={styles.itemContainer}>
                                    <Image style={styles.image}
                                           source={require("../../../../../../assets/img/EcoBeanLogo.png")}/>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.nameText}>{item?.discountDetails}</Text>
                                        <Text style={styles.phoneText}>사용기한
                                            : {item?.expirationPeriod?.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).*/, '$1 $2')}</Text>
                                        <View>
                                            <Text>
                                                {item?.menuName ?
                                                    <View style={{flex: 1, flexDirection: "column"}}>
                                                        <Text>사용가능 메뉴 : {item?.menuName}</Text>
                                                    </View> :
                                                    null}
                                            </Text>
                                        </View>
                                    </View>


                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    textContainer: {
        marginLeft: 16,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    phoneText: {
        fontSize: 16,
        color: '#999',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyCouponScreen;
