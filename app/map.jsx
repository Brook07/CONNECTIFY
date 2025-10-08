import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useGetUserID from "./hooks/useGetUserID";
import { BASE_URL } from "../config/config";
import { useRouter } from 'expo-router';



const map = () => {
  const [marker, setMarker] = useState(null);
  const [showTips, setShowTips] = useState(true); // show tips on first load
  const { userId, loading: idLoading } = useGetUserID();
  const router = useRouter();

  const handleMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const handleSaveLocation = async () => {
    if (!marker) return Alert.alert('Pick a location on the map');
    try {
      await fetch(`${BASE_URL}/set_location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          latitude: marker.latitude,
          longitude: marker.longitude
        }),
      });

      Alert.alert('Location saved!', '', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/');
          }
        }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to save location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 27.7172,
          longitude: 85.3240,
          latitudeDelta: 7.5,
          longitudeDelta: 5.0,
        }}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      {/* Help icon at top right */}
      {!showTips && (
        <TouchableOpacity style={styles.helpIcon} onPress={() => setShowTips(true)}>
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>
      )}

      {/* Help modal popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTips}
        onRequestClose={() => setShowTips(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.tipTitle}>How to set your location:</Text>
            <Text style={styles.tipText}>1. Pinch to zoom in or out on the map.</Text>
            <Text style={styles.tipText}>2. Tap on the tentative area of your temporary address.</Text>
            <Button title="OK" onPress={() => setShowTips(false)} />
          </View>
        </View>
      </Modal>

      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
};

export default map;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  helpIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  helpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%'
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  tipText: {
    fontSize: 16,
    marginBottom: 5
  }
});
