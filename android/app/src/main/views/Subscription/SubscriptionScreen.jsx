import React, {useEffect, useState} from 'react'
import {View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState";
import * as Progress from 'react-native-progress';
import GoBack from "../../components/Header/GoBack";

const SubscriptionScreen = () => {
    const [subscriptionInfo, setSubscriptionInfo] = useState({})
    const [packages, setPackages] = useState([])
    const [userInfo, setUserInfo] = useAtom(userAtom)
    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/subscription/packages`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청 성공:", result.data);
                setSubscriptionInfo(result.data.subscriptionPackageForm)
                console.log(result.data.packageFormList)
                setPackages(result.data.packageFormList)
            } catch (error) {
                // 에러 응답이 있는 경우
                if (error.response) {
                    console.log("요청 실패. 응 답  코드:", error.response.status, error.message);
                    console.log("에러 응답 데이터:", error.response.data, error.message);

                    // 여기서 error.response.status를 통해 상태 코드를 확인할 수 있습니다.
                } else if (error.request) {
                    // 요청은 전송되었지만 응답이 없는 경우
                    console.log("요청  실패. 응답이 없음");
                } else {
                    // 요청이 전송조차 되지 않은 경우
                    console.log("요청 실패. 오류 메시지:", error.message, error.message);
                }
            }
        }
        fetchMenuInfo()
    }, []);
    console.log(subscriptionInfo.packageId,"assds")
    const leftRecommendation = 20 - subscriptionInfo.recommendations
    const navigation = useNavigation()
    return (
        <FlatList
            ListHeaderComponent={() => (
                <>
                    <Text style={styles.title}>구독중인 패키지</Text>
                    {subscriptionInfo.packageId !== undefined ? (
                        <View style={styles.myCard}>
                            <View style={styles.item}>
                                <Image source={require('./../../../../../../assets/img/AmericanoPackage.png')}
                                       style={styles.itemImage}/>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{subscriptionInfo.packageName}</Text>
                                    <Text style={styles.itemPrice}>
                                        기한:{subscriptionInfo?.deadlineDate?.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).*/, '$1 $2')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.buttons}>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}
                                          onPress={() => navigation.navigate("구독주문", {subscriptionId: subscriptionInfo?.subscriptionId})}>주문하기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>연장하기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>일시중단 신청</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{paddingTop: 13}}>
                                <Text>총 추천 횟수 : {subscriptionInfo.recommendations}</Text>
                                <Text>다음 혜택까지 남은 추천 : {leftRecommendation}</Text>
                                <Progress.Bar color={"#0fa958"} progress={1} width={300}/>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.myCard}>
                            <View style={styles.item}>
                                <View style={styles.itemContent}>
                                    <Text style={[styles.itemName, {textAlign: "center"}]}>구독중인 패키지가 없습니다.</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <Text style={styles.title}>정기구독 패키지</Text>
                </>
            )}
            data={packages}
            renderItem={({item, index}) => (
                <View key={item.packageId} style={styles.card}>
                    <View style={styles.item}>
                        <Image source={require(`./../../../../../../assets/img/${1}.png`)} style={styles.itemImage}/>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemName}>{item.packageName}</Text>
                            <Text style={styles.itemPrice}>{item.packageDescription}</Text>
                        </View>
                    </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>구매하기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("패키지 구성품", {
                            packageId: item.packageId,
                            packageName: item.packageName
                        })}>
                            <Text style={styles.buttonText}>구성품 보기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            keyExtractor={(item) => item.packageId}
        />
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    myCard: {
        zIndex: 1,
        marginHorizontal: 20,
        backgroundColor: '#E7EEE8',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        zIndex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 25,
        marginHorizontal: 20,
    },
    card: {
        zIndex: 1,
        marginHorizontal: 20,
        backgroundColor: '#E7EEE8',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 20,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#0fa958',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
})

export default SubscriptionScreen
