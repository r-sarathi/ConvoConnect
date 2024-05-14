import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBell} from '@fortawesome/free-regular-svg-icons';
import Logout from '../screen/auth/Logout';

const HomeHeader = () => {
  const {userData} = useSelector(state => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.appName}>ConvoConnect</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable>
            <FontAwesomeIcon icon={faBell} color="#fff" size={20} />
          </Pressable>
          {userData.img && (
            <Pressable>
              <Image
                source={{
                  uri: userData.img,
                }}
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: 10,
                  borderRadius: 50,
                }}
              />
            </Pressable>
          )}
          <Logout />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  innerContainer: {
    margin: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
