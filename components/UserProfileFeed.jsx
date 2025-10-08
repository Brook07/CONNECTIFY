import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import RequestButton from './RequestButton';

// const placeHolderImage = require("../../assets/images/background.png");

export default function UserProfileFeed({ smallImgSource, userName, profileFeedImgSource }) {
    const [status, setStatus] = useState(null);

    if (status === null) {
        console.log(status);
        return (
                <LinearGradient
                    colors={["#fff", "#fff"]}
                    style={styles.border}
                >
                    <View style={[styles.userFeed1, Platform.OS === 'web' && { width: 450 }]}>
                        <View style={styles.profileTitleContainer}>
                            <Image source={smallImgSource} style={styles.profileSmallImage}></Image>
                            <View style={styles.profileUserNameContainer}>
                                <Text style={[styles.profileUserName]}>{userName}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={profileFeedImgSource} style={styles.profileFeedImage}></Image>
                        </View>
                        <View style={styles.buttonContainer}>
                            <RequestButton onPress={() => { setStatus(false) }} iconName="remove-circle-outline" label="Remove" iconColor="red" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14, marginLeft: 2 }} />
                            <View style={{ width: 2, height: '100%', backgroundColor: '#000', marginHorizontal: 1 }} />
                            <RequestButton onPress={() => { setStatus(true) }} iconName="check-circle-outline" label="Send Request" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14, marginLeft: 2 }} />
                        </View>
                    </View>
                </LinearGradient>
        );
    } else if (status === true) {
        console.log(status);
        return (
            <LinearGradient
                colors={["#fff", "#ffff"]}
                style={styles.border}
            >
                <View style={[styles.userFeed1, Platform.OS === 'web' && { width: 450 }]}>
                    <View style={styles.profileTitleContainer}>
                        <Image source={smallImgSource} style={styles.profileSmallImage}></Image>
                        <View style={styles.profileUserNameContainer}>
                            <Text style={[styles.profileUserName]}>{userName}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Image source={profileFeedImgSource} style={styles.profileFeedImage}></Image>
                    </View>
                    <View style={styles.buttonContainer}>
                        <RequestButton iconName="check-circle" label="Request Sent!" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }} />
                    </View>
                </View>
            </LinearGradient>
        );
    } else {
        return (
            null
        );
    }
}

const styles = StyleSheet.create({

    border: {
        padding: 10,
        // borderRadius: 10,
    },

    userFeed1: {
        width: '100%',
        height: 650,
    },

    profileTitleContainer: {
        flexDirection: "row",
        padding: 5,
        paddingLeft: 2
    },

    profileUserNameContainer: {
        justifyContent: "center",
        marginHorizontal: 5
    },

    profileUserName: {
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold"
    },

    profileSmallImage: {
        borderRadius: 20,
        width: 40,
        height: 40
    },

    profileFeedImage: {
        borderRadius: 5,
        width: '100%',
        height: '100%'
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 7,
        paddingHorizontal: 30
    },
});