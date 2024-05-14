import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import Navigation from '../../service/Navigation';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {setUser} from '../../redux/reducer/user';
import Auth from '../../service/Auth';

const Login = () => {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      if (email == '' || password == '') {
        ToastAndroid.show(
          'Fill all the fields to sign in to your account!',
          ToastAndroid.SHORT,
        );
        return false;
      }

      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);

      database()
        .ref('users/')
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then(async snapshot => {
          if (snapshot.val() == null) {
            ToastAndroid.show(
              'Invalid email or password. Please try again.',
              ToastAndroid.LONG,
            );
            return false;
          }
          let userData = Object.values(snapshot.val())[0];
          if (userData?.password != password) {
            ToastAndroid.show(
              'Invalid email or password. Please try again.',
              ToastAndroid.LONG,
            );
            return false;
          }
          console.log('User data: ', userData);
          dispatch(setUser(userData));
          await Auth.setAccount(userData);
          ToastAndroid.show('Login successfully.', ToastAndroid.SHORT);
        })
        .catch(error => {
          console.log('Error: ', error.message);
        });
    } catch (error) {
      setLoading(false);
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
      console.error('Error while logging in: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ConvoConnect</Text>
      <Text style={styles.subtitle}>Seamless Connection, Simplified</Text>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.description}>
          Enter the World of Seamless Conversations
        </Text>
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
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
      <View style={styles.createAccount}>
        <Text>Don't have an account?</Text>
        <Text
          style={styles.createAccountText}
          onPress={() => Navigation.navigate('signup')}>
          Create account
        </Text>
      </View>
    </View>
  );
};

export default Login;

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
  input: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingLeft: 10,
    color: '#000',
  },
  inputLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  forgotPassword: {
    textAlign: 'right',
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  createAccountText: {
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    marginTop: 40,
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
});
