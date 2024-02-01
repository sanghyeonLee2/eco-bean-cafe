import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {createStackNavigator} from "@react-navigation/stack";
import Home from "./android/app/src/main/views/HomeScreen/Home";
import Order from "./android/app/src/main/views/Order/Order";
import SubscriptionScreen from "./android/app/src/main/views/Subscription/SubscriptionScreen";
import MyReusableCup from "./android/app/src/main/views/ReusableCup/MyReusableCup";
import MyCouponScreen from "./android/app/src/main/views/Coupon/MyCouponScreen";
import RegisterReusableCup from "./android/app/src/main/views/ReusableCup/RegisterReusableCup";
import PackageContents from "./android/app/src/main/views/Subscription/PackageContents";
import PaymentScreen from "./android/app/src/main/views/Order/PaymentScreen";
import SubscriptionOrder from "./android/app/src/main/views/Subscription/SubscriptionOrder";
import RegisterMenu from "./android/app/src/main/views/ReusableCup/RegisterMenu";
import MyReusableCupInfo from "./android/app/src/main/views/ReusableCup/MyReusableCupInfo";
import {Provider, useAtom} from "jotai";
import {isAdminAtom, isLogInAtom, notification} from "./Store/userState";
import SignIn from "./android/app/src/main/views/SignInScreen/SignIn";
import AdminScreen from "./android/app/src/main/views/Admin/AdminScreen";
import UserManagement from "./android/app/src/main/views/Admin/UserManagement";
import ReturnReusableCup from "./android/app/src/main/views/ReusableCup/ReturnReusableCup";
import NotificationScreen from "./android/app/src/main/views/Notification/NotificationScreen";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

/*function PaymentStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={PaymentScreen}/>
             <Stack.Screen name="쿠폰" component={MyCouponScreen}/>
            {/!* 다른 화면들도 필요에 따라 추가 *!/}
        </Stack.Navigator>
    );
 }*/

function SubscriptionStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="구독" component={SubscriptionScreen}/>
            <Stack.Screen name="패키지 구성품" component={PackageContents}/>
            <Stack.Screen name="패키지 결제하기" component={PaymentScreen}
                          option={{headerTitle: (props) => <PaymentScreen {...props} />}}/>
            <Stack.Screen name="MyCoupon" component={MyCouponScreen}/>
            <Stack.Screen name="구독주문" component={SubscriptionOrder}/>
            {/* 다른 화면들도 필요에 따라 추가 */}
        </Stack.Navigator>

    );
}

function AdminScreenStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="관리자 페이지" component={AdminScreen}/>
            <Stack.Screen name="고객관리" component={UserManagement}/>
            {/* 다른 화면들도 필요에 따라 추가 */}
        </Stack.Navigator>

    );
}

function MyReusableCupStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="나의 리유저블컵" component={MyReusableCup}/>
            <Stack.Screen name="리유저블 컵 등록" component={RegisterReusableCup}/>
            <Stack.Screen name="메뉴 등록" component={RegisterMenu}/>
            <Stack.Screen name="리유저블 컵 정보" component={MyReusableCupInfo}
                          option={{headerTitle: (props) => <MyReusableCupInfo {...props} />}}/>
            <Stack.Screen name="반납하기" component={ReturnReusableCup}
                          option={{headerTitle: (props) => <ReturnReusableCup {...props} />}}/>
        </Stack.Navigator>

    );
}

function CouponStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="나의 리유저블컵" component={MyCouponScreen}/>
            <Stack.Screen name="결제" component={PaymentScreen}/>

            {/* 다른 화면들도 필요에 따라 추가 */}
        </Stack.Navigator>

    );
}

function App() {
    const [isSignIn, setIsSignIn] = useAtom(isLogInAtom);
    const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)
    const [notificationAtom, setNotificationAtom] = useAtom(notification)
    function HomeStack() {
        return (
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="EcoBean" component={Home}/>
                <Stack.Screen name="알림" component={NotificationScreen}/>
                {/* 다른 화면들도 필요에 따라 추가 */}
            </Stack.Navigator>
        );
    }
    if (!isSignIn) {
        return <SignIn/>;
    }
    return (
        <Provider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Home"
                        component={HomeStack}
                        options={{
                            title: '홈',
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="home" color={color} size={size}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Subscription"
                        component={SubscriptionStack}
                        options={{
                            title: '정기구독',
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="book" color={color} size={size}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Order"
                        component={Order}
                        options={{
                            title: '주문',
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="coffee" color={color} size={size}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="ReusableCup"
                        component={MyReusableCupStack}
                        options={{
                            title: '리유저블컵',
                            tabBarIcon: ({color, size}) => (
                                <Icon name="local-drink" color={color} size={size}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="MoreDetails"
                        component={AdminScreenStack}
                        options={{
                            title: '관리자',
                            tabBarIcon: ({color, size}) => (
                                <Icon name="more-horiz" color={color} size={size}/>
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;