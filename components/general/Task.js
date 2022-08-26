import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Task(props) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text
          style={props.isComplete ? styles.itemTextComplete : styles.itemText}>
          {props.text}
        </Text>
      </View>
      <View
        style={
          props.isComplete ? styles.circularComplete : styles.circular
        }></View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    backgroundColor: '#55bcf6',
    opacity: 0.4,
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 15,
  },

  itemText: {
    maxWidth: '80%',
  },
  itemTextComplete: {
    maxWidth: '80%',
    textDecorationLine: 'line-through',
  },

  circular: {
    width: 12,
    height: 12,
    borderColor: '#55bcf6',
    borderWidth: 2,
    borderRadius: 5,
  },

  circularComplete: {
    width: 12,
    height: 12,
    borderColor: '#55bcf6',
    backgroundColor: '#55bcf6',
    borderWidth: 2,
    borderRadius: 5,
  },
});
