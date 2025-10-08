import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import UserProfileFeed from '../../components/UserProfileFeed';
import FeedTags from '../../components/FeedTags';
import { useAuth, useUser } from '@clerk/clerk-expo';

// const placeHolderImage = require("../../assets/image/background.png");
const smallImgSource = require("../../assets/images/background.png");
const profileFeedImgSource = require("../../assets/images/background.png");
const user_name = "Bishist Bikram Pant"

export default function Home() {
    const { isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const API_URL = 'http://localhost:8000/api';

    console.log(isSignedIn);

    // useEffect(() => {
    //     // console.log("Logged in:", loggedIn);          // ✅ CHECKPOINT 4
    //     console.log("User from Clerk:", user);
    //     const sendUser = async () => {
    //         if (!user) return;
    //         console.log("user is now available", user);

    //         const token = await getToken();
    //         const emailFromClerk = user.primaryEmailAddress?.emailAddress;
    //         console.log("User email:", emailFromClerk);

    //         try {
    //             const res = await fetch(`${API_URL}/user/signup`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 body: JSON.stringify({
    //                     emailAddress: emailFromClerk,
    //                 }),
    //             });

    //             const data = await res.json();
    //             console.log('Backend response:', data);
    //         } catch (error) {
    //             console.error('Fetch user failed:', error);
    //         }
    //     }

    //     sendUser();
    // }, [user]);

    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <View style={styles.tagsContainer}>
                <FeedTags />
            </View>
            <ScrollView
                contentContainerStyle={Platform.OS === "web" && { alignItems: "center" }}
            >
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    tagsContainer: {
        backgroundColor: "white",
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: "space-between"
    },

    preferenceTagsButton: {
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 17,
        alignItems: "center"
    },

    tags: {
        padding: 5,
        paddingHorizontal: 7,
        fontSize: 15,
        fontFamily: "Poppins_400Regular"
    },

})
