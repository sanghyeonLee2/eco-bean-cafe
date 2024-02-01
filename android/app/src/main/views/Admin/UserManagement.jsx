import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Platform, Alert,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import axios, {post} from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SelectList} from "react-native-dropdown-select-list";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GoBack from "../../components/Header/GoBack";
import {useAtom} from "jotai";
import {notification} from "../../../../../../Store/userState";

const UserManagement = () => {
    const [widthArr, setWidthArr] = useState([60, 80, 90, 90, 80, 80, 85, 85]);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [period, setPeriod] = useState("")
    const [selected, setSelected] = useState("");
    const [selectedCoupon, setSelectedCoupon] = useState("");
    const [isNothing, setIsNothing] = useState("");
    const data = [
        {key: 1, value: '리유저블 컵 사용 권유'},
        {key: 2, value: '주문 권유'},
        {key: 3, value: '정기구독 권유'},

    ]
    const [notificationAtom, setNotificationAtom] = useAtom(notification)
    const giveCoupon = [
        {key: false, value: '없음'},
        {key: "아메리카노 1 + 1 쿠폰", value: '아메리카노 1 + 1 쿠폰'},
        {key: '아메리카노 주문시 라떼 업그레이드 가능 쿠폰', value: '아메리카노 주문시 라떼 업그레이드 가능 쿠폰'},
        {key: '정기구독 10% 할인 쿠폰', value: '정기구독 10% 할인 쿠폰'},
        {key: '정기구독 20% 할인 쿠폰', value: '정기구독 20% 할인 쿠폰'},
        {key: '정기구독 30% 할인 쿠폰', value: '정기구독 30% 할인 쿠폰'},
    ]
    const noOneOrder = [
        {key: false, value: '없음'},
        {key: '정기구독 1일 체험 쿠폰', value: '정기구독 1일 체험 쿠폰'},
        {key: '정기구독 2일 체험 쿠폰', value: '정기구독 2일 체험 쿠폰'},
        {key: '정기구독 3일 체험 쿠폰', value: '정기구독 2일 체험 쿠폰'},
    ]
    console.log(selectedCoupon)
    useEffect(() => {
        const fetchMenuInfo = async () => {
            try {
                const result = await axios.get(`http://${process.env.API_URL2}:8080/home/adminView`);
                console.log('요청   성공:', result.data);
                setTableData(result.data);
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchMenuInfo();
    }, []);
    const postNotification = async () => {
        const postData = {
            period: period || null,
            selectNotification: selected || null,
            selectedCoupon: selectedCoupon || null,
            isNothing: isNothing || null
        };
        console.log(postData)
        try {
            const response = await axios.post(`http://${process.env.API_URL2}:8080/home/admin-notification`,
                postData, {
                    headers: {
                        'Accept': 'application/json', // 예시: JSON을 원하는 경우
                    }
                });

            // Handle the response as needed
            console.log('Server response:', response.data);
            setNotificationAtom(true)
            setTableData(response.data);
            // Show the confirmation alert
            Alert.alert('알 림', '알림이 보내졌습니다.조건에 맞는 결과를 보여줍니다.', [
                {
                    text: '확인',
                },
            ]);

        } catch (error) {
            console.error('Error making POST request:', error);
            // Handle errors
        }
    }


    const [tableHead, setTableHead] = useState([
        '고객아이디',
        '전화번호',
        '등급',
        '환경등급',
        '구독 마감일',
        '최근 주문일',
        '총 주문수',
        '리유저블 컵 최근 사용일',
    ]);

    const filteredData = tableData.filter((rowData) =>
        Object.values(rowData).some((item) => String(item).includes(searchTerm))
    );

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150}
        >
            <View style={styles.container}>
                <GoBack/>
                <Text style={styles.title}>알림 발송</Text>
                <View style={{flex: 1, flexDirection: 'column', marginTop: 10}}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="검색..."
                        onChangeText={(text) => setSearchTerm(text)}
                        value={searchTerm}
                    />
                    {/*   <DateRangeFilter onFilter={handleDateFilter} />*/}
                    <View>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <View style={{flex: 1, flexDirection: "row"}}>
                                <TextInput
                                    style={[styles.searchInput, {width: 50, textAlign: "center"}]}
                                    keyboardType="number-pad"
                                    placeholder="0"
                                    onChangeText={(text) => setPeriod(text)}
                                    value={period}
                                />
                                <Text style={{paddingTop: 11}}>일 전부터 현재까지</Text>
                            </View>
                            <SelectList
                                setSelected={setSelected}
                                data={data}
                                arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                                searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                                search={false}
                                boxStyles={{borderRadius: 0}} //override default styles
                                defaultOption={{key: '1', value: '알림옵션 선택'}}   //default selected option
                            />
                        </View>
                        <View>
                            {selected === 1 &&
                                <Text style={{fontWeight: "bold"}}>{period}일 전부터 오늘까지 주문은 하였지만 리유저블 컵을 사용하지 않은 고객에게 알림
                                    보내는 기능</Text>}
                            {selected === 2 &&
                                <>
                                    <Text style={{fontWeight: "bold"}}>{period}일 전부터 오늘까지 주문을 하지않은 고객에게 알림을 보내고 할인 쿠폰을
                                        보낼 수
                                        있는 기능</Text>
                                    <View style={{paddingVertical: 10}}>
                                        <SelectList
                                            setSelected={setSelectedCoupon}
                                            data={giveCoupon}
                                            arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                                            searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                                            search={false}
                                            boxStyles={{borderRadius: 0}}
                                            defaultOption={{key: '1', value: '지급할 쿠폰 선택'}}/>
                                    </View></>}
                            {selected === 3 && <>
                                <Text style={{fontWeight: "bold"}}>{period}일 전부터 오늘까지 정기구독 마감일이 존재하지 않는 고객(정기구독을 한번도
                                    하지않은 고객 포함)에게 알림을 보내고 정기구독 할인 쿠폰을 보낼 수 있는 기능</Text>
                                <View style={{paddingVertical: 10}}>
                                    <SelectList
                                        setSelected={setSelectedCoupon}
                                        data={giveCoupon}
                                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                                        searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                                        search={false}
                                        boxStyles={{borderRadius: 0}}
                                        defaultOption={{key: '1', value: '지급할 쿠폰 선택'}}/>
                                </View>
                                <View style={{paddingVertical: 10}}>
                                    <Text style={{fontWeight: "bold"}}>구독을 한번도 안한고객 혜택</Text>
                                    <SelectList
                                        setSelected={setIsNothing}
                                        data={noOneOrder}
                                        arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'}/>}
                                        searchicon={<FontAwesome name="search" size={12} color={'black'}/>}
                                        search={false}
                                        boxStyles={{borderRadius: 0}}
                                        defaultOption={{key: '1', value: '지급할 쿠폰 선택'}}/>
                                </View></>}
                            <TouchableOpacity style={styles.seeAllButton} onPress={postNotification}>
                                <Text style={[{color: 'white'}, {fontSize: 12}, {padding: 2}]}
                                >알림 보내기</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

                <KeyboardAwareScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                        </Table>
                        <KeyboardAwareScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                                {filteredData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData.map((item, colIndex) => {
                                            // 마지막 열이고 값이 false인 경우에만 "정기구독" 텍스트를 표시합니다.
                                            if (colIndex === rowData.length - 1 && item === "false") {
                                                console.log("Qwe")
                                                return <Text>정기구독</Text>;
                                            }
                                            return item;
                                        })}
                                        widthArr={widthArr}
                                        style={{ ...styles.row, ...(index % 2 && { backgroundColor: '#F7F6E7' }) }}
                                        textStyle={styles.text}
                                    />
                                ))}
                            </Table>
                        </KeyboardAwareScrollView>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
    header: {height: 50, backgroundColor: '#537791'},
    text: {textAlign: 'center', fontWeight: 'bold', color: 'black'},
    dataWrapper: {marginTop: -1},
    row: {height: 40, backgroundColor: '#E7E6E1'},
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
    },
    seeAllButton: {
        height: 30,
        backgroundColor: '#092A19',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginVertical: 10,
    },
    title: {
        zIndex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 20,
    },
});

export default UserManagement;
