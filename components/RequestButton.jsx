import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function RequestButton({ onPress, iconName, iconColor, label, labelStyle }) {

    return (
        <Pressable style={styles.iconButtonContainer} onPress={onPress}>
            <MaterialIcons name={iconName} size={22} color={iconColor} />
            <Text style={labelStyle}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
})