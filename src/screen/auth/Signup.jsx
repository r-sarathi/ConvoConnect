import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faUser} from '@fortawesome/free-regular-svg-icons';
import Navigation from '../../service/Navigation';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/reducer/user';
import Auth from '../../service/Auth';

const Signup = () => {
  const dispatch = useDispatch();

  // state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // loading
  const [loading, setLoading] = useState(false);

  // image picker
  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: 1080,
        height: 1080,
        cropping: true,
      });
      console.log('Selected image: ', image);
      setProfileImage({
        filename: image.filename,
        path: image.path,
        data: image.data,
      });
    } catch (err) {
      console.log('Error while selecting image: ', err.message);
    }
  };

  const signupButton = async () => {
    try {
      if (
        name == '' ||
        email == '' ||
        password == '' ||
        about == '' ||
        profileImage == ''
      ) {
        ToastAndroid.show(
          'Fill all the fields to create an account!',
          ToastAndroid.SHORT,
        );
        return false;
      }

      setLoading(true);

      await auth().createUserWithEmailAndPassword(email, password);

      let imageUrl = '';
      if (profileImage.path) {
        const userUUID = auth().currentUser.uid;
        const storageRef = storage().ref(
          `profiles/${userUUID}/${profileImage.filename}`,
        );
        await storageRef.putFile(profileImage.path);
        imageUrl = await storageRef.getDownloadURL();
      }

      let data = {
        id: uuid.v4(),
        name: name,
        email: email,
        password: password,
        about: about,
        img: imageUrl,
      };

      console.log('Submitted data: ', data);

      database()
        .ref('/users/' + data.id)
        .set(data)
        .then(() => {
          ToastAndroid.show(
            'Account created successfully.',
            ToastAndroid.SHORT,
          );
          setName('');
          setAbout('');
          setProfileImage('');
          setEmail('');
          setPassword('');
          Navigation.navigate('home');
        });

      dispatch(setUser(data));
      await Auth.setAccount(data);

      console.log('Submitted Data: ', data);
    } catch (error) {
      setLoading(false);
      ToastAndroid.show('Please try again later.', ToastAndroid.SHORT);
      if (error.code === 'auth/invalid-credential') {
        ToastAndroid.show(
          'Invalid email or password. Please try again.',
          ToastAndroid.LONG,
        );
      }
      if (error.code === 'auth/invalid-email') {
        ToastAndroid.show(
          'Invalid email or password. Please try again.',
          ToastAndroid.LONG,
        );
      }
      if (error.code === 'auth/email-already-in-use') {
        ToastAndroid.show(
          'Invalid email or password. Please try again.',
          ToastAndroid.LONG,
        );
      }
      console.log('Error while creating an account: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>ConvoConnect</Text>
        <Text style={styles.subtitle}>Seamless Connection, Simplified</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Profile</Text>
          <TouchableOpacity
            onPress={() => openImagePicker()}
            activeOpacity={0.8}
            style={styles.profileSelection}>
            {profileImage ? (
              <Image
                source={{uri: profileImage.path}}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} size={80} color="gray" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={value => setName(value)}
            value={name}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>About Yourself</Text>
          <TextInput
            style={styles.input}
            placeholder="About Yourself"
            onChangeText={value => setAbout(value)}
            value={about}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={value => setEmail(value)}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              onChangeText={value => setPassword(value)}
              value={password}
            />
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}>
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.termsAgreement}>
          By signing up, you're agree to our{' '}
          <Text style={styles.highlight}>Terms</Text>,
          <Text style={styles.highlight}> Data Policy </Text>
          and
          <Text style={styles.highlight}> Cookies Policy</Text>.
        </Text>
        <Pressable style={styles.signupButton} onPress={signupButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
      <View style={styles.loginAccount}>
        <Text>Already have an account?</Text>
        <Text
          style={styles.loginAccountText}
          onPress={() => Navigation.navigate('login')}>
          Login
        </Text>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  header: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 2,
    color: '#000',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 10,
  },
  inputLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingLeft: 10,
    color: '#000',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    color: '#000',
  },
  eyeIcon: {
    padding: 10,
  },
  signupButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginAccountText: {
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    marginTop: 40,
  },
  termsAgreement: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  highlight: {
    fontWeight: 'bold',
  },
  profileSelection: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileText: {
    textAlign: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});
