// screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { auth } from '../firebaseConfig'; // compat version

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    auth
      .createUserWithEmailAndPassword(trimmedEmail, trimmedPassword)
      .then(() => {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Firebase Signup Error:', error);
        Alert.alert('Signup Error', error.message || 'Signup failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            title={loading ? 'Signing Up...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={loading}
          />
          <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
            Already have an account? Login
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
