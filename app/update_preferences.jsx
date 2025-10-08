import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Modal,
  Pressable,
} from "react-native";
import { BASE_URL } from "../config/config.js";
import { Colors } from "./constants/theme.js";
import useGetUserID from "./hooks/useGetUserID.js";
import { Alert } from 'react-native';

const preferencesList = [
  "Music", "Sports", "Games", "Coding", "Tech",
  "Art", "Photography", "Movies", "Fitness", "Travel",
  "Books", "Fashion", "Food", "Nature", "Anime", "Design",
];

export default function UpdatePreferencesScreen() {
  const { userId, loading } = useGetUserID();
  const [load, setLoad] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [otherPreference, setOtherPreference] = useState("");

  const [showInfo, setShowInfo] = useState(true); // show popup
  const [iconVisible, setIconVisible] = useState(false); // icon shown after dismissing popup

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  const togglePreference = (item, isSelected) => {
    if (isSelected) {
      setSelectedPreferences(selectedPreferences.filter((currentValue) => currentValue !== item));
    } else {
      setSelectedPreferences([...selectedPreferences, item]);
    }
  };

  const handleSubmit = async () => {
    setLoad(true);
    const allPreferences = [...selectedPreferences];
    if (otherPreference.trim()) {
      allPreferences.push(`Other: ${otherPreference.trim()}`);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/change_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: allPreferences,
        }),
      });

      

      const data = await response.json();
      if (data.success) {
        //router.replace('/setting');
        Alert.alert('Preferences Updated',
  'Your preferences have been changed.', [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/setting');
                }
              }
            ]);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setLoad(false);
    }
  };

  return (
    <>
      <Modal
        visible={showInfo}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose all the fields you are interested in as of now. Please select at least one.</Text>
            <Text style={styles.modalNote}>
              Note: These will replace your current ones. So, pick your old ones too, if you like them.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowInfo(false);
                setIconVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        {iconVisible && (
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowInfo(true)}
          >
            <Ionicons name="information-circle-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>What are your preferences?</Text>

        <View style={styles.preferenceGrid}>
          {preferencesList.map((item) => {
            const isSelected = selectedPreferences.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.preferenceItem,
                  (isSelected) && styles.selectedItem,
                ]}
                onPress={() => togglePreference(item, isSelected)}
              >
                <Text
                  style={[
                    styles.preferenceText,
                    (isSelected) && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          autoFocus={true}
          style={styles.input}
          placeholder="Other interests..."
          value={otherPreference}
          onChangeText={setOtherPreference}
          placeholderTextColor={Colors.lightGrey}
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Ionicons name="arrow-forward-circle" size={40} color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.black,
  },
  preferenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  preferenceItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  selectedItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  preferenceText: {
    fontSize: 14,
    color: Colors.black,
  },
  selectedText: {
    color: Colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    fontSize: 16,
    color: Colors.black,
  },
  nextButton: {
    alignSelf: "flex-end",
    marginTop: 40,
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.black,
  },
  modalNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.grey,
    marginBottom: 20,
  },
  modalButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 1,
  },

});
