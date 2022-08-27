import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/general/Task';
import CustomButton from './components/general/Button';
import CustomTextInput from './components/general/CustomTextInput';
import CustomModal from './components/general/CustomModal';

const App = () => {
  const [task, setTask] = useState(); // bisa di sebut sebagai controller text input
  const [taskItems, setTaskItems] = useState([]); // state untuk list task
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const baseUrl =
    'https://react-http-post-4ad54-default-rtdb.firebaseio.com/task/' + userId;

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleCreateUser = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        setUserId(value);
      } else {
        const uniqueId = makeid(6);
        await AsyncStorage.setItem('userId', 'user' + uniqueId);
        setUserId('user' + uniqueId);
      }
    } catch (error) {
      console.log('errorrr AsyncStorage' + error);
    }
  };

  const _clearData = async () => {
    AsyncStorage.clear();
  };

  // add new task and post to firebase
  const handleAddTask = async () => {
    Keyboard.dismiss();
    try {
      const item = {
        text: task,
        isComplete: false,
      };
      const response = await fetch(baseUrl + '.json', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {'content-type': 'application/json'},
      });
      if (!response.ok) {
        throw new Error('handleAddTask Something went wrong!');
      }
      const data = await response.json();
      setTaskItems(prevTask => {
        return [
          ...prevTask,
          {
            key: data.name,
            text: task,
            isComplete: false,
          },
        ];
      });
      setTask(null);

      console.log('TASK ADDED: ' + JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  // remove object by filtering which is isComplete value == true
  const handleDeleteTask = async () => {
    const taskComplete = taskItems.filter(task => task.isComplete == true);

    for (var _item of taskComplete) {
      try {
        const response = await fetch(baseUrl + '/' + _item.key + '.json', {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
      } catch (error) {
        console.log('DELETE ERROR nih ' + JSON.stringify(error));
      }
    }

    const taskCopy = taskItems.filter(task => task.isComplete == false);
    setTaskItems(taskCopy);
  };

  const handleFetchTask = async () => {
    console.log('infinite looping');
    setIsLoading(true);
    try {
      const response = await fetch(baseUrl + '.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      // looping Map/Object dengan key sebagai indexnya
      const loadedTask = [];
      for (var id in data) {
        loadedTask.push({
          key: id,
          text: data[id].text,
          isComplete: data[id].isComplete,
        });
      }
      setTaskItems(loadedTask);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  // mark task to give isComplete value to true
  const handleIsComplete = index => {
    const taskCopy = [...taskItems];
    taskCopy[index].isComplete = !taskCopy[index].isComplete;
    setTaskItems(taskCopy);
  };

  useEffect(() => {
    handleCreateUser();
  }, []);

  useEffect(() => {
    handleFetchTask();
  }, [userId]);

  // remove object by index
  const handleRemoveTask = index => {
    const taskCopy = [...taskItems];
    taskCopy.splice(index, 1);
    setTaskItems(taskCopy);
  };

  return (
    <View style={styles.container}>
      {/* Modal User ID*/}
      <CustomModal
        visible={modalVisible}
        onPress={() => setModalVisible(false)}
        userId={userId}
      />
      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.sectionTitle}>ID</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.items}>
          {/* This is where the task will go! */}
          {taskItems.map((item, index) => {
            return (
              <TouchableOpacity
                key={Math.random()}
                onPress={() => {
                  handleIsComplete(index);
                }}>
                <Task text={item.text} isComplete={item.isComplete} />
              </TouchableOpacity>
            );
          })}
          <View style={{marginTop: 200}} />
        </ScrollView>
      </View>

      {/* Write a task */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <View style={styles.buttonWrapper}>
          <CustomButton onPress={() => handleFetchTask()} text={'Refresh'} />
          <CustomButton onPress={() => handleDeleteTask()} text={'Delete'} />
          <CustomButton onPress={() => handleAddTask()} text={'Add'} />
        </View>
        <CustomTextInput task={task} onChangeText={text => setTask(text)} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  items: {
    marginTop: 30,
  },

  writeTaskWrapper: {
    position: 'absolute',
    bottom: 24,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  buttonWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    width: '100%',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c0c0c0',
    borderWidth: 1,
  },
  addText: {},
});
