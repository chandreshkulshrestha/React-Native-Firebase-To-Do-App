import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet, Alert,
  TextInput, Image, ActivityIndicator
} from 'react-native';
import { auth, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigation.replace('Login');
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');

      try {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}.jpg`);
        const url = await getDownloadURL(imageRef);
        setImageUri(url);
      } catch (err) {
        setImageUri(null); // No image found, ignore
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => Alert.alert('Logout Error', error.message));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!user) return;

    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      setImageUri(downloadURL);

      Alert.alert('Success', 'Profile picture uploaded!');
    } catch (error) {
      Alert.alert('Upload Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty!');
      return;
    }

    try {
      if (!user) return;
      await updateProfile(user, { displayName: displayName.trim() });
      Alert.alert('Success', 'Username updated!');
    } catch (error) {
      Alert.alert('Update Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text>No Image</Text>
        </View>
      )}

      <Button title="Choose Profile Picture" onPress={pickImage} disabled={uploading} />

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        placeholder="Enter username"
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />

      <Text style={styles.email}>Email: {user?.email}</Text>
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  placeholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  email: {
    marginTop: 20,
    color: 'gray',
  },
});
