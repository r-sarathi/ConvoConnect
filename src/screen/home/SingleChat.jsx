import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
import ChatHeader from '../../components/ChatHeader';
import {FlashList} from '@shopify/flash-list';
import MessageComponent from '../../components/MessageComponent';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage, faPaperPlane} from '@fortawesome/free-regular-svg-icons';

const SingleChat = props => {
  const {receiverData} = props.route.params;
  const {userData} = useSelector(state => state.user);

  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [allChat, setAllChat] = useState([]);

  useEffect(() => {
    const onChild = database()
      .ref('/messages/' + receiverData.roomId)
      .on('child_added', snapshot => {
        setAllChat(prevMessages => {
          if (!prevMessages.some(msg => msg.id === snapshot.key)) {
            const updatedMessages = [snapshot.val(), ...prevMessages];
            return updatedMessages;
          }
          return prevMessages;
        });
      });
    return () =>
      database()
        .ref('/messages' + receiverData.roomId)
        .off('child_added', onChild);
  }, [receiverData.roomId]);

  const messageValid = text => text && text.replace(/\s/g, '').length;

  const sendMessage = () => {
    if (message == '' || messageValid(message) == 0) {
      ToastAndroid.show('Enter something...', ToastAndroid.SHORT);
      return false;
    }
    setDisabled(true);
    let messageData = {
      roomId: receiverData.roomId,
      message: message,
      from: userData?.id,
      to: receiverData.id,
      sendTime: moment().format(''),
      msgType: 'text',
    };
    updateMessagesToFirebase(messageData);
  };

  const updateMessagesToFirebase = async messageData => {
    const newReference = database()
      .ref('/messages/' + receiverData.roomId)
      .push();
    messageData.id = newReference.key;
    newReference.set(messageData).then(() => {
      let chatListUpdate = {
        lastMsg: messageData.message,
        sendTime: messageData.sendTime,
        msgType: messageData.msgType,
      };
      database()
        .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
        .update(chatListUpdate)
        .then(() => console.log('Data updated.'));
      database()
        .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
        .update(chatListUpdate)
        .then(() => console.log('Data updated.'));

      setMessage('');
      setDisabled(false);
    });
  };

  const uploadImage = async () => {
    ImageCropPicker.openPicker({
      cropping: true,
    }).then(async image => {
      let imgName = image.path.substring(image.path.lastIndexOf('/') + 1);
      let ext = imgName.split('.').pop();
      let name = imgName.split('.')[0];
      let newName = name + Date.now() + '.' + ext;
      const reference = storage().ref('chatMedia/' + newName);
      await reference.putFile(image.path);
      const imgUrl = await storage()
        .ref('chatMedia/' + newName)
        .getDownloadURL();
      let msgData = {
        roomId: receiverData.roomId,
        message: imgUrl,
        from: userData?.id,
        to: receiverData.id,
        sendTime: moment().format(''),
        msgType: 'image',
      };
      updateMessagesToFirebase(msgData);
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ChatHeader data={receiverData} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : null}>
        <FlashList
          data={allChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          estimatedItemSize={200}
          renderItem={({item}) => {
            return (
              <MessageComponent sender={item.from == userData.id} item={item} />
            );
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <TextInput
            placeholder="Message"
            style={{
              width: '80%',
            }}
            multiline={true}
            value={message}
            onChangeText={val => setMessage(val)}
          />
          <Pressable disabled={disabled} onPress={uploadImage}>
            <FontAwesomeIcon icon={faImage} size={20} />
          </Pressable>
          <Pressable disabled={disabled} onPress={sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SingleChat;
