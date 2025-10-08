// app/(tabs)/SetTemporaryAddress.jsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SetTemporaryAddress() {
  const router = useRouter();

  const handleYes = () => {
    router.push('/map'); // Navigate to map to set address
  };

  const handleNo = () => {
    router.replace('/'); // Replace current screen with home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Do you want to set your current temporary address?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Yes" onPress={handleYes} />
        <Button title="No" onPress={handleNo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  question: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
});
