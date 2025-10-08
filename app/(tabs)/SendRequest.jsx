import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useGetUserID from "../hooks/useGetUserID";

const SendRequest = () => {
  const navigation = useNavigation();
  const { userId: loggedInUserId, loading: idLoading } = useGetUserID();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users and filter out self
  useEffect(() => {
    if (!loggedInUserId) return;

    setLoading(true);
    fetch("http://10.0.2.2:8000/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((user) => user.id !== loggedInUserId);
        setUsers(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [loggedInUserId]);

  const handleSendRequest = async (userId, userName) => {
    try {
      const res = await fetch("http://10.0.2.2:8000/requests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_user_id: loggedInUserId, to_user_id: userId }),
      });

      if (!res.ok) throw new Error("Failed to send request");

      Alert.alert("Success", `Request sent to ${userName}`);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.profile_image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.email}</Text>
        <Pressable
          onPress={() => handleSendRequest(item.id, item.name)}
          style={styles.sendButton}
        >
          <Text style={styles.sendText}>Send Request</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Send Chat Requests</Text>
      {loading || idLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No users found</Text>}
        />
      )}
    </View>
  );
};

export default SendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F0F0",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sendText: {
    color: "white",
    fontWeight: "600",
  },
});
