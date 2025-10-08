import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';

import { Colors} from "./constants/theme";
import { BASE_URL } from "../config/config";
import useGetUserID from "./hooks/useGetUserID";
//import useThemeColors from './hooks/useThemeColors';



export default function EditProfile() {
  const [userName, setuserName] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');
  const { userId, emailAddress } = useGetUserID();

  useEffect(() => {
  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${BASE_URL}/get-user-by-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      console.log("Data: ", data);

      if (res.ok) {
        setuserName(data.Name || '');
        setGender(data.gender || 'male');

        if (data.dob) {
          const date = new Date(data.dob);
          setDobYear(date.getFullYear().toString());
          setDobMonth((date.getMonth() + 1).toString().padStart(2, '0'));
          setDobDay(date.getDate().toString().padStart(2, '0'));
        }
        if (data.gender) {
          setGender(data.gender.toLowerCase()); // assuming API sends "Male", "FEMALE", etc.
        }
        setBio(data.Bio || '');
        setAddress(data.address || '');
        setContact(data.contact || '');
      } else {
        console.error("Failed to fetch user data:", data.error);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  fetchUserData();
}, [userId]);

  const handleSave = async () => {
  const fullDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

  if (!userId) {
    console.warn("User ID not available yet.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/update-user-by-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          userId,
          userName,
          dob: fullDob,
          gender,
          address,
          contact,
          bio,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Profile updated successfully:", data);
        Alert.alert(
        "Success",
        "Your profile has been updated successfully!",
        [{ text: "OK" }]
      );
      // Optional: show success message or navigate
    } else {
      console.error("❌ Failed to update profile:", data.error);
    }
  } catch (err) {
    console.error("❌ Error sending update request:", err);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userName}
          onChangeText={setuserName}
        />
      </View>
      
      <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.row}>
        <TextInput
            style={styles.input}
            placeholder="YYYY"
            value={dobYear}
            onChangeText={setDobYear}
            keyboardType="numeric"
            maxLength={4}
        />
        <TextInput
            style={styles.input}
            placeholder="MM"
            value={dobMonth}
            onChangeText={setDobMonth}
            keyboardType="numeric"
            maxLength={2}
        />
        <TextInput
            style={styles.input}
            placeholder="DD"
            value={dobDay}
            onChangeText={setDobDay}
            keyboardType="numeric"
            maxLength={2}
        />
</View>


      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        <RadioButton.Item
  label="Male"
  color={Colors.primary}
  value="male"
  status={gender === 'male' ? 'checked' : 'unchecked'}
  onPress={() => setGender('male')}
/>
<RadioButton.Item
  label="Female"
  color={Colors.primary}
  value="female"
  status={gender === 'female' ? 'checked' : 'unchecked'}
  onPress={() => setGender('female')}
/>
<RadioButton.Item
  label="Other"
  color={Colors.primary}
  value="other"
  status={gender === 'other' ? 'checked' : 'unchecked'}
  onPress={() => setGender('other')}
/>
      </View>

      <Text style={styles.label}>Address</Text>
<TextInput
  style={styles.input}
  placeholder="Address"
  value={address}
  onChangeText={setAddress}
/>

<Text style={styles.label}>Contact No</Text>
<TextInput
  style={styles.input}
  placeholder="98XXXXXXXX"
  value={contact}
  onChangeText={setContact}
  keyboardType="phone-pad"
  underlineColorAndroid="transparent"
/>

<Text style={styles.label}>Bio</Text>
<TextInput
  style={[styles.input, styles.bioInput]}
  placeholder="Tell us about yourself"
  value={bio}
  onChangeText={setBio}
  multiline
  numberOfLines={4}
/>


      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.black,
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    flex: 1,
    minWidth: '30%',
    color: Colors.black,
    
  },
  radioGroup: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',  // for Android to start text at top
},
});
