import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import Navigation from '../../service/Navigation';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import {FlashList} from '@shopify/flash-list';

const AllUser = () => {
  const {userData} = useSelector(state => state.user);

  // State variables
  const [search, setSearch] = useState('');
  const [allUser, setAllUser] = useState([]);
  const [allUserBackup, setAllUserBackup] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  // Fetch all users from the database
  const getAllUser = async () => {
    database()
      .ref('users/')
      .once('value')
      .then(snapshot => {
        const users = Object.values(snapshot.val() || {}).filter(
          userId => userId.id !== userData.id,
        );
        setAllUser(users);
        setAllUserBackup(users);
      });
  };

  // Search users by name
  const searchUser = val => {
    setSearch(val);
    setAllUser(allUserBackup.filter(user => user.name.includes(val)));
  };

  // Create a chat list between current user and selected user
  const createChatList = data => {
    database()
      .ref('/chatlist/' + userData.id + '/' + data.id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() == null) {
          const roomId = uuid.v4();
          const myData = {
            roomId,
            id: userData.id,
            name: userData.name,
            img: userData.img,
            email: userData.email,
            about: userData.about,
            lastMsg: '',
          };
          database()
            .ref('/chatlist/' + data.id + '/' + userData.id)
            .update(myData)
            .then(() => console.log('Data updated.'));
          delete data['password'];
          data.lastMsg = '';
          data.roomId = roomId;
          database()
            .ref('/chatlist/' + userData.id + '/' + data.id)
            .update(data)
            .then(() => console.log('Data updated.'));
          Navigation.navigate('singleChat', {receiverData: data});
        } else {
          Navigation.navigate('singleChat', {receiverData: snapshot.val()});
        }
      });
  };

  // Render each user item
  const renderItem = ({item}) => {
    return (
      <Pressable style={styles.userItem} onPress={() => createChatList(item)}>
        <Image source={{uri: item.img}} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text numberOfLines={1}>{item.about}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <Pressable onPress={() => Navigation.navigate('home')}>
          <FontAwesomeIcon icon={faArrowLeft} color="#fff" size={20} />
        </Pressable>
        <TextInput
          placeholder="Search by name"
          style={styles.searchInput}
          placeholderTextColor={'#fff'}
          onChangeText={val => searchUser(val)}
          value={search}
        />
      </View>
      <FlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={allUser}
        renderItem={renderItem}
        estimatedItemSize={100}
      />
    </SafeAreaView>
  );
};

export default AllUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
  },
  searchInput: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 15,
    width: '90%',
    paddingLeft: 10,
    height: 45,
    color: '#fff',
  },
  userItem: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 10,
    marginRight: 50,
  },
  userName: {
    fontWeight: 'bold',
    color: '#000',
  },
});
