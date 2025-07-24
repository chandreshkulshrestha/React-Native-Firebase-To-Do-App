import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { auth } from '../firebaseConfig'; // ✅ compat version

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('MainTabs');
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Email and password are required!');
      return;
    }

    auth.signInWithEmailAndPassword(trimmedEmail, trimmedPassword)
      .then(() => {
        Alert.alert('Success', 'Logged in successfully!');
        navigation.replace('MainTabs');
      })
      .catch((error) => {
        console.error('Login Error:', error);
        Alert.alert('Login Error', error.message);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Checking session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don’t have an account? Sign Up
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10,
  },
  link: {
    color: 'blue', marginTop: 10, textAlign: 'center',
  },
});
