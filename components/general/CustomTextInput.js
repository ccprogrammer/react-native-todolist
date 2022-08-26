import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';

const CustomTextInput = props => {
  return (
    <TextInput
      style={styles.input}
      placeholder={'Write a task'}
      value={props.task}
      onChangeText={props.onChangeText}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    width: '100%',
  },
});
