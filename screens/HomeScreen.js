// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const user = auth.currentUser;

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Add task
  const handleAddTask = async () => {
    if (!task.trim()) {
      Alert.alert('Validation Error', 'Task cannot be empty!');
      return;
    }

    try {
      await addDoc(collection(db, 'todos'), {
        text: task.trim(),
        uid: user.uid,
        createdAt: new Date(),
        completed: false,
      });
      setTask('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Toggle complete/incomplete
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'todos', taskId), {
        completed: !currentStatus,
      });
    } catch (error) {
      Alert.alert('Toggle Error', error.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'todos', taskId));
    } catch (error) {
      Alert.alert('Delete Error', error.message);
    }
  };

  // Render each task
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
        <Text style={[styles.task, item.completed && styles.completedTask]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <Button title="Delete" color="red" onPress={() => handleDeleteTask(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <TextInput
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  task: {
    fontSize: 16,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
