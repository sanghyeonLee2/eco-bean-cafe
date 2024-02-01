import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DateRangeFilter = ({onFilter}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        // 여기에서 유효성을 검사하고 필터링 로직을 수행합니다.
        if (startDate && endDate) {
            onFilter(startDate, endDate);
        }
    };

    return (
            <View style={styles.dateRangeFilter}>
                <Text>시작 날짜:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChangeText={(text) => setStartDate(text)}
                />
                <Text>종료 날짜:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChangeText={(text) => setEndDate(text)}
                />
                <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
                    <Text style={styles.filterButtonText}>필터</Text>
                </TouchableOpacity>
            </View>
    );
};

const styles = StyleSheet.create({
    dateRangeFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 10,
        width: 80,
        fontSize: 10.5
    },
    filterButton: {
        height: 40,
        backgroundColor: '#092A19',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginLeft: 10,
    },
    filterButtonText: {
        color: 'white',
        textAlign: "center",
        fontSize: 12,
        padding: 2,
        width: 50
    },
});

export default DateRangeFilter;
