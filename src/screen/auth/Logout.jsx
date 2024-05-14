import {Pressable, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import Auth from '../../service/Auth';
import Navigation from '../../service/Navigation';
import {useDispatch} from 'react-redux';
import {removeUser} from '../../redux/reducer/user';

const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await auth().signOut();
      await Auth.logout();
      dispatch(removeUser());
      ToastAndroid.show('Logged out successfully.', ToastAndroid.SHORT);
      Navigation.navigate('login');
    } catch (error) {
      ToastAndroid.show(
        'An error occured while logging out.',
        ToastAndroid.SHORT,
      );
      console.log('Error during logout: ', error);
    }
  };

  return (
    <Pressable onPress={handleLogout} style={styles.logoutButton}>
      <Text
        style={{
          color: '#000',
          fontSize: 12,
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 10,
          fontWeight: 'bold',
        }}>
        Logout
      </Text>
    </Pressable>
  );
};

export default Logout;

const styles = StyleSheet.create({
  logoutButton: {
    marginLeft: 10,
  },
});
