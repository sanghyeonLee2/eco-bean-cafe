import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const OtherScreen = () => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        style={styles.avatar}
                        source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar1.png' }}
                    />

                    <Text style={styles.name}>John Doe</Text>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/cottage.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/administrator-male.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/filled-like.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/facebook-like.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/shutdown.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/traffic-jam.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/dusk/70/000000/visual-game-boy.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/flat_round/70/000000/cow.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>

                    <View style={styles.menuBox}>
                        <Image
                            style={styles.icon}
                            source={{ uri: 'https://img.icons8.com/color/70/000000/coworking.png' }}
                        />
                        <Text style={styles.info}>Icon</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00BFFF',
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 100,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        paddingTop: 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    textInfo: {
        fontSize: 18,
        marginTop: 20,
        color: '#696969',
    },
    menuBox: {
        backgroundColor: '#DCDCDC',
        width: 86,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
            width: -2,
        },
        elevation: 4,
    },
    icon: {
        width: 60,
        height: 60,
    },
    info: {
        fontSize: 22,
        color: '#696969',
    },
})

export default OtherScreen