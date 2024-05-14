import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import Navigation from '../service/Navigation';

const ChatHeader = props => {
  const {data} = props;
  const [lastSeen, setLastSeen] = useState('');

  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#000',
      }}>
      <Pressable onPress={() => Navigation.back()}>
        <FontAwesomeIcon icon={faArrowLeft} color="#fff" size={20} />
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <Image
          source={{uri: data.img}}
          style={{width: 40, height: 40, borderRadius: 50}}
        />
        <Text
          style={{
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {data.name}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({});
