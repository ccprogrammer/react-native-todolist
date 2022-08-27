import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';


const CustomModal = props => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        // setModalVisible(!modalVisible);
      }}>
      <View style={styles.overlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>User ID</Text>
            <Text style={styles.modalSubText}>{props.userId}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={props.onPress}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  // Modal style

  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    alignSelf: 'stretch',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 8,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  modalSubText: {
    marginBottom: 24,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
