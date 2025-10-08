import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View
} from "react-native";
import ChangePasswordScreen from '../components/ChangePasswordScreen';
import { Colors } from "./constants/theme";
import useGetUserID from "./hooks/useGetUserID";



export default function SettingsScreen() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { signOut } = useClerk();
  const { userId: userId, loading: idLoading } = useGetUserID();


  const handleSignOut = async () => {
    try {
      // Clear AsyncStorage first
      await AsyncStorage.clear();
      await signOut();
      // Redirect to your desired page
      // ⚠️ Wait briefly to ensure session is cleared

      Linking.openURL(Linking.createURL('/login'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const handleLogoutConfirm = () => {
    console.log("User logged out");
    setLogoutVisible(false);
    // Add logout logic here
  };


  const updateAddress=  ()=>{
    router.push(`/map`);
  }

  const bgColor = darkMode ? "#000" : Colors.white;
  const textColor = darkMode ? Colors.white : Colors.black;
  const inputBg = darkMode ? "#1a1a1a" : Colors.white;
  const borderColor = darkMode ? "#333" : Colors.grey;

  return (

    <>
      <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 15 }}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/profile')}>
          <Ionicons name="chevron-back-outline" size={31} color="black" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.heading, { color: textColor }]}>Settings</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>








       
  <TouchableOpacity
    style={[styles.optionRow, { backgroundColor: '#0066cc', borderColor: '#0066cc', marginBottom: 15 }]}
    onPress={() => {
      // Add your handler here
      console.log("Update Preferences");
    }}
  >
    <Text style={[styles.optionText, { color: '#fff', textAlign: 'center', flex: 1 }]}
    onPress={() => router.push('/update_preferences')}>
      Update Preferences
    </Text>
  </TouchableOpacity>








         {/* Update Temporary Address Button */}
  <TouchableOpacity
    style={[styles.optionRow, { backgroundColor: '#0066cc', borderColor: '#0066cc', marginBottom: 15 }]}
    onPress={() => {
      // Add your handler here
      console.log("Update Temporary Address button pressed");
    }}
  >
    <Text style={[styles.optionText, { color: '#fff', textAlign: 'center', flex: 1 }]}
    onPress={() => router.push('/map')}>
      Update Temporary Address
    </Text>
  </TouchableOpacity>

        {/* Change Password Option */}
        {/* <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setShowChangePassword(!showChangePassword)}
      >
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} />
        <Text style={[styles.optionText, { color: textColor }]}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
      </TouchableOpacity> */}


        {/* Theme Toggle Option */}
        {/* <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Ionicons name="moon-outline" size={24} color={Colors.primary} />
        <Text style={[styles.optionText, { color: textColor }]}>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
      </TouchableOpacity> */}

        {/* Logout Option */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => {
            setLoading(true);
            setLogoutVisible(true);
          }
          }
        >
          {
            loading ? (
              <ActivityIndicator style={{}} color={Colors.grey} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={24} color="#fff" style={{ paddingHorizontal: 10 }} />
                <Text style={[styles.optionText, { color: "#fff" }]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
              </>
            )
          }
        </TouchableOpacity>

        {/* Custom Modal */}
        <Modal
          visible={logoutVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLogoutVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: bgColor, borderColor: borderColor },
              ]}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>Confirm Logout</Text>
              <Text style={[styles.modalText, { color: textColor }]}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: Colors.grey }]}
                  disabled={!loading}
                  onPress={() => {
                    setLoading(false);
                    setLogoutLoading(false);
                    setLogoutVisible(false);
                  }}
                >

                  <Text style={styles.cancelButtonText}>Cancel</Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    handleSignOut();
                    setLogoutLoading(true);
                  }}
                >
                  {
                    logoutLoading ? (
                      <ActivityIndicator style={{}} color={Colors.grey} />
                    ) : (
                      <Text style={styles.logoutButtonText}>Logout</Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 0,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    paddingLeft: 10
    // marginBottom: 30,
    // textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#bf0603',
    borderColor: '#bf0603',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 2,
  },
  passwordForm: {
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.black,
    fontWeight: "500",
  },
  logoutButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "red",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
