import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Alert} from 'react-native';
import * as Progress from 'react-native-progress';
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState";
import {triggerAtom} from "../../../../../../Store/triggerState";

const MyReusableCup = ({route}) => {
    const [userInfo, setUserInfo] = useAtom(userAtom)
    const [reusableCup, setReusableCup] = useState({})
    const [isSubscriptionOrder, setSubscriptionOrder] = useState(false);
    const [trigger, setTrigger] = useAtom(triggerAtom)
    const {params} = route;
    const data = params && params?.data;
    const navigation = useNavigation()

    const barcodeOrder = async (reusableCupId) => {
        const obj = {
            reusableCupId,
            storeId: 1,
            isSubscriptionOrder
        }
        try {
            const result = await axios.post(`http://${process.env.API_URL2}:8080/reusableCup/finishOrder`, obj)
            console.log("요  청 성공:", result.data);
            Alert.alert('알림', '등록된 메뉴 주문이 완료되었습니다', [
                {
                    text: '확인',
                },
            ]);
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

    const returnCup = async (reusableCupId) => {
        const obj = {
            reusableCupId,
            storeId: 1,
        }
        try {
            const result = await axios.post(`http://${process.env.API_URL2}:8080/reusableCup/returned`, obj)
            console.log("요청       성공:", result.data);
            setTrigger(!trigger)
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
    console.log(params,"asdasd")

    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/reusableCup/list`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청     성공:", result.data);
                setReusableCup(result.data)
            } catch (error) {
                // 에러 응답이 있는 경우
                if (error.response) {
                    console.log("요청  실패. 응답 코드:", error.response.status, error.message);
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
    /*  if (data) {
          Alert.alert("리유저블 컵 등록", `바코드 번호 : ${data}\n리유저블 컵을 등록 하시겠습니까?`,
              [{text: "취소", style: "cancel"},
                  {text: "확인"}]);
      }*/

    return (
        <>
            <View style={styles.container}>
                <Text>나의 총 리유저블 컵 사용횟수: {reusableCup.totalUsedReusableCup}</Text>
                <Text style={[styles.cardInfoLabel, {color: "green"}]}>환경등급</Text>
                <Text style={[styles.cardInfoValue, {color: "darkgreen"}]}>{reusableCup.userEnvironmentLevel}</Text>
                <ScrollView
                    contentContainerStyle={styles.carouselContainer}
                    showsHorizontalScrollIndicator={false}
                >
                    {reusableCup?.myReusableCupListResDtoList && reusableCup?.myReusableCupListResDtoList.map((card) => (
                        <View key={card?.reusableCupId}>
                            <View style={styles.cardContainer}>
                                <Text style={styles.cardNumber}>컵 번호:{card?.reusableCupId}</Text>
                                <Text style={styles.status}>상태:{card?.returned ? "반납완료" : "사용중"}</Text>
                                <View style={styles.sliderContainer}>
                                    <Text style={styles.sliderNum}>0</Text>
                                    <Progress.Bar progress={1} width={250}/>
                                    <Text style={styles.sliderNum}>20</Text>
                                    <Text style={styles.useNum}>사용횟수{card?.numberUses}</Text>
                                </View>
                                <View style={styles.cardInfoContainer}>
                                    <View style={{marginTop: 10}}>
                                        <View style={{flex: 1, flexDirection: "row"}}>
                                            <View style={{marginRight: 5}}>
                                                <Text style={[styles.cardInfoLabel, {textAlign: "center"}]}>등록된
                                                    메뉴</Text>
                                                <Text
                                                    style={styles.cardInfoValue}>{card?.menuName ? card?.menuName : "등록된 메뉴 없음"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.cardInfoLabel}>                구매일</Text>
                                                <Text
                                                    style={styles.cardInfoValue}>{card?.purchaseDate?.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).*/, '$1 $2')}</Text>
                                            </View>
                                        </View>
                                        <View style={{marginBottom: 20}}>
                                            <Text style={styles.cardInfoLabel}>구독주문 가능 여부</Text>
                                            <Text
                                                style={styles.cardInfoValue}>{card?.subscriptionAvailableMenuCheck ? <>가능</> : <>불가능</>}</Text>
                                        </View>
                                    </View>
                                    <View style={{position: "absolute", left: 110, top: 83}}>
                                        <Text style={[styles.cardInfoLabel]}>구독 주문여부</Text>
                                        <TouchableOpacity style={styles.cardInfoValue}
                                                          onPress={() => setSubscriptionOrder(!isSubscriptionOrder)}>
                                            <View
                                                style={[styles.checkbox, isSubscriptionOrder && styles.checkedCheckbox]}/>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flex: 1, flexDirection: "column", marginLeft: 23, marginBottom: 10,}}>
                                        <TouchableOpacity style={styles.cupButton} onPress={() => {
                                            navigation.navigate("메뉴 등록", {
                                                reusableId: card?.reusableCupId,
                                            });
                                        }}>
                                            <Text style={styles.buttonText}>메뉴등록</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cupButton}>
                                            <Text style={styles.buttonText}
                                                  onPress={() => barcodeOrder(card?.reusableCupId)}>주문</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cupButton}>
                                            <Text style={styles.buttonText}
                                                  onPress={() => returnCup(card?.reusableCupId)}>반납</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.paymentButton}>
                        <Text style={styles.buttonText} onPress={() => {
                            navigation.navigate("리유저블 컵 등록")
                        }}>추가하기</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 5,
    },
    container: {
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00008B',
    },
    cardContainer: {
        marginBottom: 10,
        marginHorizontal: 10,
        width: 350,
        height: 260,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 6,
        borderBottomColor: '#ccc',
    },
    cardNumber: {
        fontSize: 18,
        letterSpacing: 4,
    },
    status: {
        fontSize: 13,
        letterSpacing: 4,
    },
    cardInfoContainer: {
        position: "relative",
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardInfoLabel: {
        fontSize: 12,
        color: 'gray',
    },
    cardInfoValue: {

        fontSize: 13,
        fontWeight: 'bold',
    },
    carouselContainer: {
        marginVertical: 40,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 30,
    },
    cupButton: {
        width: 95,
        marginTop: 5,
        backgroundColor: '#00008B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        height: 37,
    },
    paymentButton: {
        backgroundColor: '#00008B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center"
    },
    sliderContainer: {
        position: 'relative',
        padding: 15,
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sliderNum: {
        margin: 3
    },
    useNum: {
        position: "absolute",
        bottom: 1,
        fontSize: 11,
        right: "90%",
        paddingBottom: 3
    }
});

export default MyReusableCup;