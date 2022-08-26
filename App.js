import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/general/Task';
import CustomButton from './components/general/Button';
import CustomTextInput from './components/general/CustomTextInput';

const App = () => {
  const [task, setTask] = useState(); // bisa di sebut sebagai controller text input
  const [taskItems, setTaskItems] = useState([]); // state untuk list task
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

  const test = async () => {
    console.log(userId);
  };

  const _clearData = async () => {
    AsyncStorage.clear();
  };

  // add new task and post to firebase
  const postDatabase = async () => {
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
        throw new Error('postDatabase Something went wrong!');
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
  const removeDatabase = async () => {
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

  const fetchDatabase = async () => {
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
    fetchDatabase();
  }, [userId]);

  // remove object by index
  const handleRemoveTask = index => {
    const taskCopy = [...taskItems];
    taskCopy.splice(index, 1);
    setTaskItems(taskCopy);
  };

  return (
    <View style={styles.container}>
      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
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
        </View>
      </View>

      {/* Write a task */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <View style={styles.buttonWrapper}>
          <CustomButton onPress={() => fetchDatabase()} text={'Refresh'} />
          <CustomButton onPress={() => removeDatabase()} text={'Delete'} />
          <CustomButton onPress={() => postDatabase()} text={'Add'} />
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
