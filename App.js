import React, {AsyncStorage,useState, useEffect, useReducer, useContext} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressCircle from 'react-native-progress/Circle';
import TesseractOcr, {
  LANG_CHINESE_SIMPLIFIED,
  useEventListener,
} from 'react-native-tesseract-ocr';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import BaiduOcrScan from 'react-native-baidu-camera-ocr-scan';

// import RNTextDetector from "react-native-text-detector";

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

const AuthContext = React.createContext();

const Stack = createStackNavigator();

// console.log({BaiduOcrScan});

// const initOcr=()=>{
//    console.log('ee');
//    BaiduOcrScan.init("WKzM2XshcpY7pHc4lkt6uw4b","8IlnLuBgdBYGT56pQU1HCxvcl3NGbzp1",(data)=>{
//     console.log(`初始化成功 code=${data}`);
//    });
// }

//  //相机
// const callCamera=()=>{
//   BaiduOcrScan.callCamera((data)=>{
//     console.log("输出调用相机回调");
//     console.log(data);
//   });
// }

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}



function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  useEffect(()=>{

  },[]);

 

  return (
    <View className="loginPage" style={styles.loginPage}>
      <Text style={styles.indexName}>扫描器</Text>
      <View style={styles.formWrap}>
        <TextInput
          className="userName"
          style={styles.inputArea}
          placeholder="请输入用户名"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="userPsd"
          style={styles.inputArea}
          placeholder="请输入密码"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableHighlight
        // onPress={() => signIn({username, password})}
        onPress={()=>{
          signIn({type: 'SIGN_IN', token: 'dummy-auth-token'});
        }}
        activeOpacity={0.85}>
        <View style={styles.loginBtn}>
          <Text style={{fontSize: 18, color: '#fff'}}>登录</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
} 

function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [text, setText] = useState('');
  useEventListener('onProgressChange', (p) => {
    setProgress(p.percent / 100);
  });

  const recognizeTextFromImage = async (path) => {
    setIsLoading(true);
    console.log({path});
    try {
      const tesseractOptions = {};
      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_CHINESE_SIMPLIFIED,
        tesseractOptions,
      );
      setText(recognizedText);
    } catch (err) {
      console.error(err);
      setText('');
    }

    setIsLoading(false);
    setProgress(0);
  };

  const recognizeFromPicker = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openPicker(options);
      setImgSrc({uri: image.path});
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const recognizeFromCamera = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openCamera(options);
      setImgSrc({uri: image.path});
      await recognizeTextFromImage(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tesseract OCR example</Text>
      <Text style={styles.instructions}>Select an image source:</Text>
      <View style={styles.options}>
        <View style={styles.button}>
          <Button
            disabled={isLoading}
            title="Camera"
            onPress={() => {
              recognizeFromCamera();
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            disabled={isLoading}
            title="Picker"
            onPress={() => {
              recognizeFromPicker();
            }}
          />
        </View>
      </View>
      {imgSrc && (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={imgSrc} />
          {isLoading ? (
            <ProgressCircle showsText progress={progress} />
          ) : (
            <Text>{text}</Text>
          )}
        </View>
      )}
    </View>
  );

  // return(<></>)
}

function App({navigation}) {
  // const [isLogin, setIsLogin] = useState(false);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('123456');

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  const MainStackScreen = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                // title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={MainStackScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  // return isLogin ? <Index /> : <Login />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginVertical: 15,
    height: DEFAULT_HEIGHT / 2.5,
    width: DEFAULT_WITH / 2.5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loginPage: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeec',
  },
  indexName: {
    fontSize: 28,
    // color:'#000'
  },
  formWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    // backgroundColor:'#fff'
  },
  inputArea: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderColor: '#7b7b79',
    marginBottom: 20,
    borderRadius: 10,
    paddingLeft: 10,
  },
  loginBtn: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2abae9',
  },
});

export default App;
