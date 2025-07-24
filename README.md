# 📝 React Native Firebase To-Do App

This is a To-Do List mobile application built with **React Native** using **Firebase** for authentication, Firestore for task storage, and Firebase Storage for user profile images.

> ✅ Features: User Authentication, Add/Delete Tasks, Profile Update, Logout, Image Upload, Persistent Login

---

## 📱 Features

### 🔐 Authentication
- Email/password based login & signup
- Persistent login session using Firebase Authentication

### 🧾 To-Do List
- Add new tasks
- Delete existing tasks
- Mark tasks as **complete/incomplete** (Coming Soon)
- Tasks stored per user using Firebase Firestore

### 👤 Profile
- Display user's email, username, and profile image
- Change username
- Upload and view profile picture using Firebase Storage
- Logout functionality

### 🧭 Navigation
- Bottom tab navigation using `react-navigation`
  - **To-Do List**
  - **Profile**

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| React Native | UI Development |
| Firebase Auth | User Login/Signup |
| Firestore | Task storage per user |
| Firebase Storage | Profile image upload |
| React Navigation | Tab-based screen navigation |
| Expo | App development & testing (optional if you're using Expo) |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js
- npm or yarn
- Android Studio or Expo Go (for testing)
- Firebase project

---

### 🔗 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password Authentication** in Authentication > Sign-in method.
3. Create a Firestore database.
4. Enable Firebase Storage.
5. Add a new Android/iOS app and get the Firebase config.
6. Replace the config in your `firebaseConfig.js`:

```js
// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
export default firebase;
