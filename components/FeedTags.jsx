import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import { Platform } from 'react-native';
import { useState } from 'react';

export default function FeedTags({ tags, checker, issSelected }) {
    // const tags = ["Music", "Sports", "Games", "Coding", "Tech", "Art", "Photography", "Movies", "Fitness", "Travel", "Books", "Fashion", "Food", "Nature", "Anime", "Design"];
    // const [selectedTags, setSelectedTags] = useState([]);
    // console.log(selectedTags);

    return (
        <FlatList
            horizontal
            data={tags}
            showsHorizontalScrollIndicator={Platform.OS === "web"}
            renderItem={({ item }) => {
                const isSelected = issSelected(item);
                // const checker = () => {
                //     if (isSelected) {
                //         setSelectedTags(selectedTags.filter((currentValue) => currentValue != item));
                //     } else {
                //         setSelectedTags([...selectedTags, item]);
                //     }
                // };
                return (
                    <Pressable
                        style={[styles.preferenceTagsButton, { color: isSelected ? "white" : "black", backgroundColor: isSelected ? "#008000" : "white", borderColor: isSelected ? "#008000" : "#ccc"}]}
                        onPress={() => {
                            console.log('clicked');
                            checker(isSelected, item);
                        }} key={item}>
                        <Text style={styles.tags}>{item}</Text>
                    </Pressable>
                )
            }}
        />
    );
}

const styles = StyleSheet.create({
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