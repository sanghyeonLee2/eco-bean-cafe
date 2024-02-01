import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    ScrollView,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import {SelectList} from "react-native-dropdown-select-list";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import Modal from "react-native-modal";
import axios from "axios";
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState"
import GoBack from "../../components/Header/GoBack";

const PaymentScreen = () => {
    var today = new Date();
    const [userInfo, setUserInfo] = useAtom(userAtom)

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '-' + month + '-' + day;
    const [paymentInfo, setPaymentInfo] = useState({})
    const route = useRoute();
    const {selectedOption, packagePrice, packageId, packageName} = route?.params;
    const {couponId} = route?.params;
    const [selectedCard, setSelectedCard] = useState(""); // State to store the selected card
    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
    const navigation = useNavigation();
    const [usedPoints, setUsedPoints] = useState(0); // State for 포인트 사용
    const [referralId, setReferralId] = useState(""); // State for 추천인 ID
    const cardOptions = ["1", "2", "3"]; // Add more cards as needed
    console.log(usedPoints, usedPoints, referralId, selectedCard, couponId)
    const selectCard = (card) => {
        setSelectedCard(card);
        setModalVisible(false);
    };
    const invoiceData = {
        invoiceNumber: '12345',
        invoiceDate: '01/01/2022',
        dueDate: '01/15/2022',
        amountDue: '$100.00',
        client: {
            name: 'John Doe',
            address: '123 Main St\nAnytown, USA 12345',
            logo: 'https://www.bootdey.com/image/280x280/FF00FF/000000',
        },
        items: [
            /* {
                 id: 1,
                 type: "ice",
                 description: '아아',
                 quantity: 2,
                 isReUsable: "리유저블컵",
                 price: '5,000',
             },
             {
                 id: 2,
                 type: "hot",
                 description: '콜드브루',
                 quantity: 1,
                 isReUsable: "리유저블컵",
                 price: '2,500',
             },*/
            {
                id: 3,
                type: "ice",
                description: 'Item 3',
                isReUsable: "리유저블컵",
                quantity: 3,
                price: '2,500',
            },
        ],
    };

    const {
        invoiceNumber,
        invoiceDate,
        dueDate,
        amountDue,
        client,
        items,
    } = invoiceData;

    const purchase = async () => {
        const data = {
            userId: userInfo.userId,
            couponId,
            packageId,
            period: selectedOption,
            cardId: selectedCard,
            recommendedUserId: referralId
        }

        console.log("userId : ", data.userId, "couponId : ", data.couponId, "packageId : ", data.packageId, "cardId:", selectedCard, "data.period:", data.period, "recommendedUserId: ", data.recommendedUserId)
        try {
            const response = await axios.post(`http://${process.env.API_URL2}/subscription/purchase`,
                data, {
                    headers: {
                        'Accept': 'application/json', // 예시: JSON을 원하는 경우
                    }
                });

            // Handle the response as needed
            console.log('Server response:', response.data);

            // Show the confirmation alert
            Alert.alert('알림', '패키지 주문이 완료되었습니다', [
                {
                    text: '확인',
                    onPress: () => {
                        // Navigate back to the previous screen
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                        });
                    },
                },
            ]);
        } catch (error) {
            console.error('Error making POST request:', error);
            // Handle errors
        }
    }

    return (
        <View>
            <GoBack/>
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>주문 내역</Text>
                </View>
                <View style={styles.itemsContainer}>
                    {items.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <View
                                key={item.id}
                                style={[
                                    styles.itemRow,
                                    isEven ? styles.itemRowEven : styles.itemRowOdd,
                                ]}
                            >
                                <Image source={{uri: 'https://www.bootdey.com/image/280x280/FF00FF/000000'}}
                                       style={styles.img}/>
                                <View>
                                    <Text style={styles.itemDescription}>{packageName}</Text>
                                    <Text style={styles.smallFont}>{selectedOption}개월</Text>
                                    {/* <Text style={styles.smallFont}>{item.isReUsable}</Text>*/}
                                </View>
                                <View style={styles.orderInfoText}>
                                    <Text style={styles.itemPrice}>1개/{packagePrice}원</Text>
                                </View>
                            </View>
                        );
                    })}
                    <View style={styles.saleLayout}>
                        <Text style={{fontSize: 12}}>주문정보</Text>
                        <View style={styles.alignCenter}>
                            <View style={styles.row}>
                                <Text style={styles.usePoint}>포인트 사용</Text>
                                <TextInput
                                    style={[styles.usePointInput, {paddingBottom: 3}]}
                                    value={usedPoints.toString()} // Use the state value for points
                                    onChangeText={(text) => setUsedPoints(text)} // Update state when input changes
                                />
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.useBtn}>전액</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.usePoint}>쿠폰 사용</Text>
                                <TouchableOpacity>
                                    <Text style={styles.totalPrice} onPress={() => {
                                        navigation.navigate('MyCoupon', {
                                            selectedOption,
                                            packagePrice,
                                            packageName,
                                            packageId
                                        })
                                    }}>
                                        {couponId ? <>{couponId}선택</> : <>쿠폰함 가기</>}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.usePoint}>추천인 ID</Text>
                                <TextInput
                                    style={[styles.usePointInput, {paddingBottom: 3}]}
                                    placeholder={"추천인 ID"}
                                    value={referralId} // Use the state value for referral ID
                                    onChangeText={(text) => setReferralId(text)} // Update state when input changes
                                />
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.useBtn}>확인</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.usePoint}>카드선택 </Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.usePointInput}>
                                    <Text>{selectedCard || "Select Card"}</Text>
                                </TouchableOpacity>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => setModalVisible(false)}
                                >
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalText}>Select a Card</Text>
                                            <FlatList
                                                data={cardOptions}
                                                keyExtractor={(item) => item}
                                                renderItem={({item}) => (
                                                    <TouchableOpacity onPress={() => selectCard(item)}>
                                                        <Text style={styles.modalOption}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                                <Text style={styles.modalClose}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                    </View>
                    <View style={styles.total}>
                        <Text style={{fontSize: 12}}>총 수량 / 총 금액 / 할인금액</Text>
                        <Text style={styles.totalFont}>1개 / {packagePrice}원 / {usedPoints}원</Text>
                    </View>
                    <View style={styles.total}>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>최종 결제 금액</Text>
                        <Text
                            style={[styles.totalFont, {fontSize: 18}]}>{packagePrice - usedPoints}원</Text>
                    </View>
                </View>
                <View style={styles.infoMsg}>
                    <Text>리유저블 컵 오늘까지 총 11회 사용됬습니다</Text>
                    <Text style={styles.smallFont}>*권장사용횟수: 20회</Text>
                    <Text style={styles.smallFont}>*남은 권장사용횟수: 20회</Text>
                    <Text style={styles.infoText}>~가 되기까지 19번 남았어요</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.label}>주문 일시</Text>
                    <Text style={styles.value}>{dateString}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.orderBtn}
                        onPress={() => console.log('Share')}
                    >
                        <Text style={{color: "white"}} onPress={purchase}>결제하기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalOption: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalClose: {
        fontSize: 16,
        color: "#2196F3",
        marginTop: 10,
    },
    saleLayout: {
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 15,
        marginBottom: 10,
        flex: 1,
        flexDirection: "row",
        position: "relative",

    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    infoText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
    usePoint: {
        fontSize: 12,
        marginRight: 15
    },
    infoMsg: {
        paddingTop: 25,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    usePointLocation: {
        position: "absolute",
        fontSize: 12,
        left: -5
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    alignCenter: {
        paddingLeft: 100,
        flex: 1,
        alignItems: "flex-start"
    },
    img: {
        width: 85,
        height: 85,
        marginHorizontal: 10
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    body: {
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderInfoText: {
        flex: 1
    },
    value: {
        fontSize: 16,
    },
    row: {
        marginVertical: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center"
    },
    itemsContainer: {
        paddingTop: 20,
    },
    smallFont: {
        marginBottom: 3,
        fontSize: 13,
        color: "gray"
    },
    itemsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    total: {
        marginTop: 8,
        marginBottom: 30,
        marginLeft: 30,
        flex: 1,
        flexDirection: "row"
    },
    itemRowEven: {
        backgroundColor: '#eee',
    },
    itemRowOdd: {
        backgroundColor: '#fff',
    },
    itemDescription: {
        flex: 1,
        fontSize: 16,
    },
    sale: {

        flex: 1,
        flexDirection: "row"
    },
    itemQuantity: {
        width: 50,
        fontSize: 16,
        textAlign: 'center',
    },
    itemPrice: {
        fontWeight: 'bold',
        paddingTop: 60,
        width: 100,
        fontSize: 15,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    orderBtn: {
        borderRadius: 5,
        backgroundColor: '#0fa958',
        width: 80,
        paddingTop: 10,
        paddingLeft: 15,
        height: 40,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
    },
    clientLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    clientText: {
        flex: 1,
    },

    totalFont: {
        marginLeft: 15,
        fontWeight: "bold",
        fontSize: 12,
    },
    useBtn: {
        right: 2,
        color: "white",
        position: "absolute",
        backgroundColor: '#092A19',
        borderRadius: 5,
        marginLeft: 13,
        height: 20,
        fontSize: 10,
        paddingTop: 3,
        textAlign: "center",
        width: 30,
        bottom: -10
    },
    usePointInput: {
        fontSize: 11,
        paddingLeft: 12,
        borderRadius: 5,
        paddingTop: 5,
        backgroundColor: '#ccc',
        width: 100,
        height: 25
    },
    totalPrice: {
        borderRadius: 5,
        marginLeft: 10,
        height: 25,
        width: 100,
        fontSize: 11,
        padding: 6,
        textAlign: "center",
        color: "white",
        backgroundColor: '#092A19',
    }
});


export default PaymentScreen;