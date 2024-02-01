import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Alert} from 'react-native';
import {SelectList} from "react-native-dropdown-select-list";
import axios from "axios";
import {useNavigation, useRoute} from "@react-navigation/native";
import Modal from "react-native-modal";
import {useAtom} from "jotai";
import {userAtom} from "../../../../../../Store/userState";
import {userTriggerAtom} from "../../../../../../Store/triggerState";
import GoBack from "../../components/Header/GoBack";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ProductCard = ({item}) => {


    return (
        <View style={styles.productCard}>
            <Image source={{uri: 'https://source.unsplash.com/900x900/?burger'}} style={styles.productImage}/>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>메뉴가격 : {item?.menuForm.menuName}</Text>
                <Text style={styles.productDescription}>메뉴설명: {item?.menuForm.menuDescription}</Text>
                <Text style={styles.productDescription}>적립 예정 금액 : {item?.menuForm.deductedAmount}</Text>
                <Text style={styles.productPrice}>{item?.menuForm.menuPrice}원</Text>
                <Text style={[styles.productName, {fontSize: 12}]}>레시피</Text>
                {item.menuRecipeForms && item.menuRecipeForms.map((ele) => {
                    return <View key={ele?.ingredientId}>
                        <Text style={styles.productDescription}>재료이름: {ele?.ingredientName}</Text>
                        <Text style={styles.productDescription}>사용량: {ele?.usedAmount}{ele?.ingredientUnit}</Text>
                    </View>
                })}
            </View>

        </View>
    );
};


const SubscriptionOrder = () => {
    const [userTrigger,setUserTriggerAtom] = useAtom(userTriggerAtom)
    const [reusableCupInfo, setReusableCupInfo] = useState([])
    const [store, setStore] = useState([])
    const [userInfo, setUserInfo] = useAtom(userAtom)
    const [menu, setMenu] = useState([])
    const route = useRoute();
    const {subscriptionId} = route?.params
    const [selectedReusableCup, setSelectedReusableCup] = useState("")
    const [selectedStore, setSelectedStore] = useState("");
    const [selectedTemperature, setSelectedTemperature] = useState("hot");
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectMenu, setSelectMenu] = useState("")
    const navigation = useNavigation()
    const register = async () => {
        // Close the bottom sheet
        closeBottomSheet();


        // Make a POST request to your server
        try {
            const response = await axios.post(`http://${process.env.API_URL2}:8080/subscription/finalOrder`,
                {
                    userId: userInfo.userId,
                    subscriptionId,
                    storeId: selectedStore,
                    reusableCupId: selectedReusableCup,
                    availableMenuId: selectMenu
                });

            // Handle the response as needed
            console.log('Server response:', response.data);

            // Show the confirmation alert
            Alert.alert('알림', '메뉴 등록이 완료되었습니다', [
                {
                    text: '확인',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}]
                        });
                    },
                },
            ]);
        } catch (error) {
            console.error('Error making POST request:', error);
            // Handle errors
        }
    }

    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/subscription/order`, {
                    params: {
                        subscriptionId
                    }
                })
                console.log("요청 성공:", result.data);
                setStore(result?.data.storeFormList)
                setMenu(result?.data.availableMenuFormList)
                setUserTriggerAtom(userTrigger)
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

    console.log(selectMenu, "QWEQWE")
    const renderProductItem = ({item}) => (
        <TouchableOpacity onPress={() => {
            setSelectMenu(item.menuForm.menuId)
            setBottomSheetVisible(true)
            fetchReusableCupInfo();
        }}>
            <ProductCard item={item}/>
        </TouchableOpacity>
    );

    const fetchReusableCupInfo = async () => {
        try {
            const response = await axios.get(`http://${process.env.API_URL2}:8080/reusableCup/list`, {
                params: {
                    userId: userInfo.userId
                }
            });

            // Handle the response as needed
            console.log('Reusable Cup Info:', response.data);

            // Update reusableCupInfo atom with the response data
            setReusableCupInfo(response.data.myReusableCupListResDtoList);
        } catch (error) {
            console.error('Error fetching reusable cup information:', error);
            // Handle errors
        }
    };
    console.log(reusableCupInfo, "ASDASD")

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    return (
        <View style={styles.container}>
            <GoBack/>
            <SelectList
                setSelected={setSelectedStore}
                data={store.map((storeItem) => ({key: storeItem?.storeId, value: storeItem?.storeName}))}
                arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                search={false}
                boxStyles={{borderRadius: 0}}
                defaultOption={store.length > 0 ? {key: store[0]?.storeId, value: store[0]?.storeName} : null}
            />
            <FlatList
                data={menu}
                style={styles.productList}
                renderItem={renderProductItem}
                keyExtractor={(item) => item?.menuForm.menuId}
                contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 100}}
            />
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
                    <SelectList
                        setSelected={setSelectedReusableCup}
                        data={reusableCupInfo.map((item) => ({
                            key: item?.reusableCupId,
                            value: item?.reusableCupId,
                            reusableId: item?.reusableCupId, // Assuming reusableId is available in storeItem
                        }))}
                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                        searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                        search={false}
                        boxStyles={{borderRadius: 0}}
                        defaultOption={store.length > 0 ? {
                            key: reusableCupInfo[0]?.reusableCupId,
                            value: reusableCupInfo[0]?.reusableCupId
                        } : null}
                    />
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
        marginRight: 16,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
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
    productDescription: {
        fontSize: 14,
        color: '#666',
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
    productAmount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountButton: {
        width: 30,
        height: 30,
        backgroundColor: '#ffa726',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#0fa958',
    },
    amountButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,

    },
    buttonText: {
        textAlign: "center",
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
});

export default SubscriptionOrder;