import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import UserProfileFeed from '../../components/UserProfileFeed';
import FeedTags from '../../components/FeedTags';
import { useAuth } from '@clerk/clerk-expo';
import useGetUserID from '../hooks/useGetUserID';
import { BASE_URL } from "../../config/config"; // adjust the path as needed

// const placeHolderImage = require("../../assets/image/background.png");
const smallImgSource = require("../../assets/images/background.png");
const profileFeedImgSource = require("../../assets/images/background.png");
const user_name = "Bishist Bikram Pant"
// const tags = ["Music", "Sports", "Games", "Coding", "Tech", "Art", "Photography", "Movies", "Fitness", "Travel", "Books", "Fashion", "Food", "Nature", "Anime", "Design"];

export default function Home() {
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const { userId } = useGetUserID();
    const { isSignedIn } = useAuth();
    const [loading, setLoading] = useState(false);


    // console log to check sign in state and users retrieved
    console.log(isSignedIn);
    console.log(userId);
    console.log('users:', users);
    console.log('selected tags:', selectedTags);

    // to retrieve tags dynamically 
    useEffect(() => {
        const retrieveTags = async () => {
            setLoading(true);
            try {
                console.log('Calling API to retrieve tags:', `${BASE_URL}/api/get-tags`);
                const response = await fetch(`${BASE_URL}/api/get-tags`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                    },
                });


                const data = await response.json();
                console.log('tags:', data);
                setTags(data.arrayOfTags);
                setLoading(false);

                if (!response.ok) {
                    console.log("API call failed", response.ok);
                }

            } catch (err) {
                console.error('Error fetching tags:', err);
                setLoading(false);
            }
        };

        retrieveTags();
    }, []);

    // to retrieve user profile
    useEffect(() => {
        if (!userId) return;
        const retrieveUser = async () => {
            // setLoading(true);
            try {
                console.log('Calling API:', `${BASE_URL}/api/get-user-profile`);
                // Send user email to backend MySQL
                const response = await fetch(`${BASE_URL}/api/get-user-profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: userId,
                        tags: selectedTags
                    })
                });

                console.log('Response status:', response.status);
                const data = await response.json();

                setUsers(data.result);
                // setLoading(false);

                if (!response.ok) {
                    console.log("API call failed", response.ok);
                }
            } catch (error) {
                console.error("Error retrieving users:", error);
                // setLoading(false);
            }
        }
        retrieveUser();

    }, [userId, selectedTags]);

    const issSelected = (item) => (selectedTags.includes(item));

    const checker = (isSelected, item) => {
        if (isSelected) {
            setSelectedTags(selectedTags.filter((currentValue) => currentValue != item));
        } else {
            setSelectedTags([...selectedTags, item]);
        }
    };

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
            {/* { */}
                {/* // loading && <ActivityIndicator color="#FFFFFF" /> */}
            {/* } */}
            <View style={styles.tagsContainer}>
                <FeedTags tags={tags} checker={checker} issSelected={issSelected} />
            </View>
            <ScrollView
                contentContainerStyle={Platform.OS === "web" && { alignItems: "center" }}
            >
                {
                    users?.length ? users.map((user) => {
                        console.log(user.userId)
                        return (
                            <UserProfileFeed
                                key={user.userId}
                                userName= {user.name}
                                smallImgSource={smallImgSource}
                                profileFeedImgSource={profileFeedImgSource}
                                
                            />
                        )
                    }) : null
                }
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
