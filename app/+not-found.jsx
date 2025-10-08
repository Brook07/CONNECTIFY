import { StyleSheet, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

// for routes that do not match, the navigation will end at this file and for this file to be navigated when routes do not match the naming format should be "+not-found"
export default function NotFound() {
    return (
        <>
            <View>
                <Text style={styles.fonts}>
                    NOT FOUND!!!
                </Text>
                <Link href="/">Go to Home Page</Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    fonts: {
        fontSize: 30,
    }
});