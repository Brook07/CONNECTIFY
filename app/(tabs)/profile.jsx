import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
//import axios from 'axios';
import { router } from 'expo-router';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from "../../config/config";
import useGetUserID from "../hooks/useGetUserID";




const ProfilePage = ()=>{
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [photos, setPhotos] = useState([]);
  const {userId} = useGetUserID();
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
const [previewImageUri, setPreviewImageUri] = useState(null);

  console.log("USER ID IS   ",userId);
  const handlePickImage = async () => {
    // const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (!permissionResult.granted) return alert('Permission required!');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });
    console.log(`resultAA = ${result}`)
    console.log(`${result.assets[0].uri}`)
    const uri = result.assets[0].uri;
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(uri);
      setModalVisible(false);
      console.log("Result is", JSON.stringify(result, null, 2));
      await uploadImage(uri);
    }
    else{
      console.log("No U!resultcancelled");
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
      formData.append("pfp", {
    uri: uri,
    name: "upload.jpg",           // any name with valid extension
    type: "image/jpeg",           // or image/png etc.
  });

  formData.append("userId", userId);

     try {
    const res = await fetch(`${BASE_URL}/upload-pfp`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const text = await res.text(); // 🔄 Try text first
    if (!res.ok) {
      console.error("❌ Upload failed:", text);
      return;
    }

    const data = JSON.parse(text); // ✅ now safe to parse
    console.log("✅ Upload success:", data);
     // ✅ Immediately update UI
    // setUploadedUrl(`${BASE_URL}/uploads/${data.filename}`);
  } catch (error) {
    console.error("❌ Upload error:", error);
  }

};

const handleAddPhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const uri = result.assets[0].uri;
    const formData = new FormData();

    formData.append("image", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg"
    });
    formData.append("userId", userId);

    const res = await fetch(`${BASE_URL}/upload-photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    const data = await res.json();
    console.log("Photo uploaded:", data);
    fetchUserPhotos(); // refresh UI
  }
};

const fetchUserPhotos = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user-photos/${userId}`);
    const data = await res.json();
    setPhotos(data.map(item => `${BASE_URL}/${item.image_path}`));
  } catch (error) {
    console.error("Failed to fetch photos", error);
  }
};
useEffect(() => {
  if (userId) fetchUserPhotos();
}, [userId]);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}`);
      const data = await res.json();

      if (data.profile_image) {
        setUploadedUrl(`${BASE_URL}${data.profile_image}`);
      }
      console.log(data.Name);
      if (data.Name) {
         setUserName(data.Name);  // Use exact column name from SQL
      }
      console.log(data.Bio);
      if(data.Bio){
        setBio(data.Bio);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (userId) fetchUserData();
}, [userId]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowLayout}>
        {/* 🔘 Change Picture */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.sideButton}>Change Picture</Text>
        </TouchableOpacity>

        {/* 🖼️ Profile Image */}
        <View style={styles.profileCircle}>
          <Image
        source={
          uploadedUrl
            ? { uri: uploadedUrl }
            : selectedImage
            ? { uri: selectedImage }
            : require('../../assets/images/pfp.png')
        }
        style={styles.profileImage}
      />
        </View>

        {/* 🔘 Edit Profile */}
        <TouchableOpacity onPress={() => router.push('/editProfile')}>
          <Text style={styles.sideButton}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Username and rest */}
      <Text style={styles.username}>{userName}</Text>

      <View style={styles.bioContainer}>
        <Text>{bio}</Text>
      </View>

      {/* Photos tab */}
      <View style={styles.photosTab}>
        <Text style={styles.photosTabText}>Photos</Text>
        <TouchableOpacity onPress={handleAddPhoto}>
          <Text style={styles.addPhotoButton}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.photoGrid}>
  {photos.map((uri, idx) => (
    <TouchableOpacity
      key={idx}
      onPress={() => {
        setPreviewImageUri(uri);
        setPreviewVisible(true);
      }}
    >
      <View style={styles.photoBox}>
        <Image source={{ uri }} style={styles.photos} />
      </View>
    </TouchableOpacity>
  ))}
</View>

      {/* 🔳 Popup Modal */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Profile Picture</Text>
            <Button title="Choose from Gallery" onPress={handlePickImage} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/*Photo*/}
        <Modal
          visible={previewVisible}
          transparent={true}
          onRequestClose={() => setPreviewVisible(false)}
        >
          <View style={styles.fullScreenModal}>
            <Image source={{ uri: previewImageUri }} style={styles.fullImage} />
            <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  profileCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    //borderWidth: 3,
    borderColor: '#000',
    resizeMode: 'cover', // or 'contain'
  },
  editButton: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  connectText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  bioContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    marginVertical: 2,
  },
  photosTab: {
    // backgroundColor:"#28a745",
    width: '40%',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  photosTabText: {
    fontSize: 16,
    // fontWeight: '500',
    color: "#000",
    // textDecorationLine:'underline', 
    fontFamily: 'Instagram Sans Bold.ttf'
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',           // ✅ allows wrapping
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,                     // ✅ spacing between boxes
},
  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
},
  photos: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
},
  modalBackground: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContainer: {
  width: 300,
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  elevation: 10,
  alignItems: 'center',
},
rowLayout: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  marginBottom: 20,
  gap: 10,
},

sideButton: {
  fontSize: 14,
  color: '#333',
  textDecorationLine: 'underline',
  maxWidth: 80,
  textAlign: 'center',
},
    addPhotoButton: {
      fontSize: 24,
      marginLeft: 10,
      color: '#28a745',
    },

fullScreenModal: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},
fullImage: {
  width: '90%',
  height: '70%',
  resizeMode: 'contain',
  borderRadius: 10,
},
closeButton: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 5,
},
closeButtonText: {
  fontSize: 16,
  color: '#000',
},
});

export default ProfilePage;
