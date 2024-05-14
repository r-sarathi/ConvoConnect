import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HomeHeader from '../../components/HomeHeader';
import Logout from '../auth/Logout';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import Navigation from '../../service/Navigation';
import {FlashList} from '@shopify/flash-list';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';

const Home = () => {
  const {userData} = useSelector(state => state.user);

  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    getChatList();
  }, []);

  const getChatList = async () => {
    database()
      .ref('/chatlist/' + userData?.id)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          setChatList(Object.values(snapshot.val()));
        }
      });
  };

  const renderItem = ({item}) => {
    return (
      <Pressable
        style={{
          margin: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
        onPress={() => Navigation.navigate('singleChat', {receiverData: item})}>
        <Image
          source={{uri: item.img}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#000',
            }}>
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginRight: 60,
            }}>
            {item.msgType === 'image'
              ? 'Image'
              : 'Tech enthusiast and avid gamer. Always curious about the latest gadgets and innovations.'}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{flex: 1}}>
      <HomeHeader />
      <FlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={chatList}
        renderItem={renderItem}
        estimatedItemSize={100}
      />
      <Pressable
        style={styles.floatingButton}
        onPress={() => Navigation.navigate('allUser')}>
        <FontAwesomeIcon icon={faUsers} color="#fff" size={20} />
      </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
