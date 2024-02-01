import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Button} from 'react-native'
import * as Progress from 'react-native-progress';
import axios from "axios";
import {useAtom, useAtomValue} from "jotai";
import {isLogInAtom, notification, userAtom} from "../../../../../../Store/userState";
import {userTriggerAtom} from "../../../../../../Store/triggerState";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import globalStyles from "../../../../../../constant/path-to-globalStyles";
import {useNavigation} from "@react-navigation/native";

const Home = () => {
    const [isLogIn, setIsLogIn] = useAtom(isLogInAtom)
    const userTrigger = useAtomValue(userTriggerAtom)
    const [userInfo, setUserInfo] = useAtom(userAtom)
    const [noti, setNoti] = useState(0)
    const [notification, setNotification] = useAtom(userAtom)
    const matches = [
        {
            id: 1,
            avatar: 'https://bootdey.com/img/Content/avatar/avatar2.png',
            name: 'John Doe',
            age: '30',
        },
    ]

    console.log(userInfo)

    const [homeScreenInfo, setHomScreenInfo] = useState({})
    useEffect(() => {
        const fetchMenuInfo = async () => {
            console.log(process.env.API_URL2)
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/home`, {
                    params: {
                        userId: userInfo.userId
                    }
                })
                console.log("요청               성공:", result.data);
                setHomScreenInfo(result.data)
                setNoti(result?.data?.notificationInfoForm)
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
    }, [userInfo, userTrigger]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.avatar} source={require('./../../../../../../assets/img/EcoBeanLogo.png')}/>
                <View style={styles.informationContainer}>
                    <Text style={[styles.name, globalStyles.text]}>{userInfo.userId}님</Text>
                    <View style={styles.logOut}>
                        <TouchableOpacity onPress={() => setIsLogIn(false)}>
                            <MaterialCommunityIcons name={"logout"} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pointLayout}>
                        <Text style={[globalStyles.text, {position: "absolute", bottom: 2}]}>포인트
                            : {homeScreenInfo?.point}P</Text>
                        {homeScreenInfo?.subscriptionName ?
                            <TouchableOpacity style={styles.pointBtn}>
                                <Text style={styles.infoText}>적립 및 사용내역</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.infoText2}>
                                <Text style={styles.infoText}>적립 및 사용내역</Text>
                            </TouchableOpacity>}
                    </View>
                    <View style={styles.pointLayout}>
                        <View>
                            <Text style={[globalStyles.text, styles.subStyle]}>My 구독
                                : {homeScreenInfo?.subscriptionName ? <>{homeScreenInfo?.subscriptionName}</> : <Text>구독이
                                    없습니다.</Text>}
                            </Text>
                            {homeScreenInfo?.subscriptionName &&
                                <Text style={globalStyles.text}>구독 종료일
                                    : {homeScreenInfo?.deadlineDate?.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).*/, '$1 $2')}</Text>}
                        </View>
                        {homeScreenInfo?.subscriptionName &&
                            <TouchableOpacity style={[styles.pointBtn, {height: 40, top: -13}]}>
                                <Text style={styles.infoText}>연장하기</Text>
                            </TouchableOpacity>}
                    </View>
                    <View style={styles.btnInProfile}>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={[{color: "white"}, {fontSize: 12}, {padding: 2}]}>혜택보기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={[{color: "white"}, {fontSize: 12}, {padding: 2}]}>쿠폰함</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={[{color: "white"}, {fontSize: 12}, {padding: 2}]}>내 정보</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}></Text>
                </View>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.normalGrade, globalStyles.text]}>일반등급</Text>
                    <View style={styles.progressText}>
                        <View style={styles.pointLayout}>
                            <Text style={styles.gradeText}>{homeScreenInfo?.rating}</Text>
                            <Text style={styles.label}>다음
                                등급까지 {Number(homeScreenInfo?.totalOrderPrice) - 10000}원 </Text>
                        </View>
                        <Progress.Bar progress={1} color={"#0fa958"} width={270}/>
                    </View>
                    <Text style={[styles.naturalGrade, globalStyles.text]}>환경등급</Text>

                    <View style={styles.progressText}>
                        <View style={styles.pointLayout}>
                            <Text style={styles.gradeText}>{homeScreenInfo?.environmentTreeName}</Text>
                            <Text style={styles.label}>다음 등급까지 {120 - Number(homeScreenInfo?.reusableCupUsed)}회</Text>
                        </View>
                        <Progress.Bar progress={1} color={"#0fa958"} width={270}/>
                        <Text style={{fontSize: 10, marginTop: 10}}>리유저블 컵 총 {homeScreenInfo?.reusableCupUsed}회
                            사용</Text>
                    </View>
                </View>
            </View>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>알림</Text>
                </View>
                <View style={styles.sectionBody}>
                    <View style={[styles.sectionCard, {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 10
                    }]}>
                        {noti === 0 ?
                            <><Text style={{fontSize: 18, fontWeight: "bold"}}>
                                정기 구독을 하세요!
                            </Text>
                                <Text>{noti?.notificationContent}</Text>
                                <Text>자세한 내용 보기</Text></> :
                            <><Text>리뷰저블 컵의 수명은 20회 입니다. </Text>
                                <Text>리뷰저블 컵 반납시 1000포인트 지급!</Text></>}
                    </View>
                </View>
            </View>
            {/*<View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle]}>New Event</Text>
                </View>
                <View style={styles.sectionBody}>
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionImage}/>
                        <View style={styles.sectionInfo}>
                            <Text style={styles.sectionLabel}></Text>
                        </View>
                    </View>
                </View>
            </View>*/}
        </ScrollView>
    )
}
export default Home
const styles = StyleSheet.create({
    subStyle: {
        position: "absolute",
        bottom: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative"
    },
    btnInProfile: {
        bottom: 18,
        position: "absolute",
        flex: 1,
        flexDirection: "row",
    },
    header: {
        backgroundColor: '#E7EEE8',
        height: 310,
        flexDirection: 'row',
        paddingTop: 35,
        paddingHorizontal: 16,
    },
    avatar: {
        borderWidth: 3, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        marginTop: 5,
        width: 95,
        height: 120,
        borderRadius: 4,
    },
    informationContainer: {
        paddingTop: 5,
        height: 130,
        marginLeft: 8
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 11,
    },
    section: {
        paddingHorizontal: 16,
        marginVertical: 5,
    },
    slider: {

        width: '80%',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
    },
    infoText: {
        color: "white",
        fontSize: 9
    },
    pointBtn: {
        right: -47,
        position: "absolute",
        bottom: 17,
        height: 18,
        backgroundColor: '#0fa958',
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    infoText2: {
        right: -233,
        position: "absolute",
        bottom: 17,
        height: 18,
        backgroundColor: '#0fa958',
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    seeAllButton: {
        bottom: -40,
        left: 40,
        height: 30,
        marginRight: 10,
        backgroundColor: '#092A19',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    sectionBody: {
        marginTop: 10,
    },
    sectionScroll: {
        paddingBottom: 20,
    },
    logOut: {
        position: "absolute",
        left: 233,
    },
    sectionCard: {
        width: "100",
        height: 150,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 1,
        margin: 10,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: "black",
        backgroundColor: "#E7EEE8"
    },
    sectionImage: {
        width: '100%',
        aspectRatio: 1,
    },
    sliderContainer: {
        paddingLeft: 100,
        bottom: 2,
        left: 60,
        position: "absolute",
        width: '60%',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionInfo: {
        padding: 10,
    },
    sectionLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    pointLayout: {
        position: "relative",
        flex: 1,
        flexDirection: "row",
        marginBottom: 3,
    },
    progressText: {
        marginBottom: 9,
        alignItems: "center",
        flex: 1,
        paddingBottom: 5
    },
    normalGrade: {
        position: "absolute",
        left: -45,
    },
    naturalGrade: {
        position: "absolute",
        left: -45,
        top: 40,
    },
    gradeText: {
        position: "absolute",
        left: -77,
        top: -3,
        fontSize: 15,
        fontWeight: "bold"
    }
})