import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import moment from 'moment';

const MessageComponent = props => {
  const {sender, item} = props;

  const renderMessage = () => {
    if (item.msgType === 'image') {
      return (
        <Image source={{uri: item.message}} style={{width: 300, height: 300}} />
      );
    } else {
      return (
        <>
          <Text
            style={{
              fontWeight: 'bold',
            }}>
            {item.message}
          </Text>
          <Text
            style={{
              fontSize: 10,
            }}>
            {moment(item.sendTime).format('LLL')}
          </Text>
        </>
      );
    }
  };

  return (
    <Pressable
      style={{
        marginVertical: 10,
        alignSelf: sender ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={{
          backgroundColor: sender ? '#E0E0E0' : '#2196F3',
          borderRadius: 10,
          padding: 10,
          maxWidth: '80%',
        }}>
        {renderMessage()}
      </View>
    </Pressable>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({});
