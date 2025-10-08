import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const router = useRouter();
const ProfilePage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCircle}>
        <Image style={styles.profileImage} source={require("../assets/images/pfp.png")} />
        
        {/* edit profile button */}
        {/* <TouchableOpacity>
          <Text style={styles.editProfile} onPress={() => router.push('/editProfile')}>Edit Profile</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.username}>Username</Text>

      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectText}>Connect</Text>
        {/* <View style={styles.greenDot} /> */}
      </TouchableOpacity>

      <View style={styles.bioContainer}>
        <Text>
          Bio here
        </Text>
      </View>

      <View style={styles.photosTab}>
        <Text style={styles.photosTabText}>Photos</Text>
      </View>

      <View style={styles.photoGrid}>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../assets/images/emoji1.png")} />
        </View>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../assets/images/emoji2.png")} />
        </View>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../assets/images/emoji3.png")} />
        </View>
      </View>
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
  editProfile: {
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
    width: '20%',
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
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  photoBox: {
    width: 130,
    height: 150,
  },
  photos: {
    width: 130,
    height: 150,
  }
});

export default ProfilePage;
