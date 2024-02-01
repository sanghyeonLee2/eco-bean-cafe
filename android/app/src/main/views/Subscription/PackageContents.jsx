import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {RadioButton} from 'react-native-paper';
import axios from "axios";
import GoBack from "../../components/Header/GoBack";

const PackageContents = () => {
    const navigation = useNavigation();
    const route = useRoute()
    const {packageId, packageName} = route?.params
    const [packageDetail, setPackageDetail] = useState([])
    const [packagePeriod, setPackagePeriod] = useState([])
    console.log(packageDetail,"ASDASDF")
    useEffect(() => {
        const fetchMenuInfo = async ()  => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/subscription/showPackageInfo`, {
                    params: {
                        packageId
                    }
                })
                console.log("요청  성공:", result.data);
                setPackagePeriod(result.data.packageDetailFormList)
                setPackageDetail(result.data.availableMenuFormList)
            } catch (error) {
                // 에러 응답이 있는 경우
                if (error.response) {
                    console.log("요청 실패. 응답  코드:", error.response.status, error.message);
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

    const [selectedOption, setSelectedOption] = useState("1"); // Default: 1개월
    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };
    console.log(packageId)
    const calculatePrice = () => {
        switch (selectedOption) {
            case "1":
                return packagePeriod[0]?.price; // 1개월 가격
            case "2":
                return packagePeriod[1]?.price; // 2개월 가격
            case "3":
                return packagePeriod[2]?.price; // 3개월 가격
            case "4":
                return packagePeriod[3]?.price; // 1개월 가격
            case "5":
                return packagePeriod[4]?.price; // 2개월 가격
            case "6":
                return packagePeriod[5]?.price; // 3개월 가격
            default:
                return packagePeriod[6]?.price;
        }
    };

    return (
        <>
            <GoBack/>
            <ScrollView style={styles.container}>
                <Text style={styles.subject}>{packageName}</Text>
                <Text>가격 : {calculatePrice()}원</Text>
                <Text style={styles.optionLabel}>선택 옵션 </Text>
                <View style={styles.optionContainer}>
                    <RadioButton.Group
                        onValueChange={(value) => handleOptionChange(value)}
                        value={selectedOption}
                    >
                        <View style={styles.optionList}>
                            <View style={styles.radioOption}>
                                <RadioButton value="1"/>
                                <Text style={styles.optionText}>1개월</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="2"/>
                                <Text style={styles.optionText}>2개월</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="3"/>
                                <Text style={styles.optionText}>3개월</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="4"/>
                                <Text style={styles.optionText}>4개월</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="5"/>
                                <Text style={styles.optionText}>5개월</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton value="6"/>
                                <Text style={styles.optionText}>6개월</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                </View>
                {packagePeriod.length > 0 && (
                    <View style={styles.attachments}>
                        <Text style={styles.attachmentsText}>옵션 가격</Text>
                        {packagePeriod.map((item, idx) => (
                            <View key={idx} style={styles.attachment}>
                                <View>
                                    <Text style={styles.attachmentText}>기간 : {item.period}개월</Text>
                                    <Text style={styles.downloadText}>가격 : {item.price}원</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                <View style={styles.body}>
                    <Text style={styles.bodyText}>
                        아메리카노 패키지의 상세내용
                    </Text>
                </View>
                {packageDetail.length > 0 && (
                    <View style={styles.attachments}>
                        <Text style={styles.attachmentsText}>구성품</Text>
                        {packageDetail.map((item) => (
                            <View key={item.menuId} style={styles.attachment}>
                                <Image style={styles.thumbnail}
                                       source={require("../../../../../../assets/img/coldbrew1.png")}/>
                                <View>
                                    <Text style={styles.attachmentText}>메뉴명 : {item.menuForm.menuName}</Text>
                                    <Text style={styles.downloadText}>메뉴 가격 : {item.menuForm.menuPrice}원</Text>
                                    <Text style={styles.downloadText}>구독 주문시 적립 예정 포인트
                                        : {item.menuForm.deductedAmount}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}
                          onPress={() => {
                              navigation.navigate("패키지 결제하기", {
                                  selectedOption,
                                  packagePrice: calculatePrice(),
                                  packageId,
                                  packageName// 여기에 패키지 이름을 추가해주세요
                              });
                          }}>구매하기</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        backgroundColor: '#fafafa',
    },
    subject: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color: '#222'
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    optionLabel: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#555',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        flexWrap: 'wrap', // 옵션 목록이 화면을 넘어가면 다음 줄에 나타나도록 설정
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5, // 각 옵션 사이의 간격 조정
    },

    body: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#b3b3b3',
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    attachments: {
        marginTop: 20,
    },
    attachmentsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    attachment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    thumbnail: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    attachmentText: {
        fontSize: 14,
        color: '#555',
    },
    downloadText: {
        fontSize: 14,
    },
    button: {
        backgroundColor: '#0fa958',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
    },
    buttonText: {
        textAlign: "center",
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default PackageContents;

