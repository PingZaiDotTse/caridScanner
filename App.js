import React, {
  AsyncStorage,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  Modal,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Camera from './camera.js';

import {
  fetchDataFromServer,
  getMoviesFromApi,
  accessBaiduToken,
} from './utils/fetchData.js';

import {RNCamera} from 'react-native-camera';

// import BaiduOcrScan from 'react-native-baidu-camera-ocr-scan';

// import RNTextDetector from "react-native-text-detector";

// console.log({fetchDataFromServer});

const RNFS = require('react-native-fs');

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  // cropping: true,
  // height: DEFAULT_HEIGHT,
  // width: DEFAULT_WITH,
  includeBase64: true,
};

const AuthContext = React.createContext();

const Stack = createStackNavigator();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function ActivityIndicatorMod() {
  return (
    <View style={[styles.indicatorContainer, styles.horizontal]}>
      {/* <ActivityIndicator />
          <ActivityIndicator size="large" />
          <ActivityIndicator size="small" color="#0000ff" /> */}
      <ActivityIndicator size="large" color="#fefefc" />
    </View>
  );
}

const modalTool = (carid) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{{carid}}</Text>
          <TouchableHighlight
            style={{...styles.openButton, backgroundColor: '#2196F3'}}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.textStyle}>确定</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    // detectText();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => hideKeyboard()}>
      <View className="loginPage" style={{...styles.loginPage,paddingBottom:40+'%'}}>
        {/* <Text style={styles.indexName}>扫描器</Text> */}
        <Image
          style={{width: 100, height: 100, marginBottom: 20}}
          source={require('./assets/images/logo.png')}
        />
        <View style={styles.formWrap}>
          <View style={styles.textInput}>
            <Image
              style={{width: 20, height: 20}}
              source={require('./assets/images/userLogo.png')}
            />
            <TextInput
              className="userName"
              style={styles.inputArea}
              placeholder="请输入用户名"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={{...styles.textInput, marginBottom: 0}}>
            <Image
              style={{width: 20, height: 20, right: 0}}
              source={require('./assets/images/psdLogo.png')}
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
        </View>
        <Text
          style={{
            color: '#6089ee',
            alignSelf: 'flex-end',
            right: 50,
            marginBottom: 20,
          }}>
          忘记密码
        </Text>
        <TouchableHighlight
          onPress={() => {
            signIn({type: 'SIGN_IN', token: 'dummy-auth-token'});
          }}
          activeOpacity={0.85}>
          <View style={styles.loginBtn}>
            <Text style={{fontSize: 18, color: '#fff'}}>登录</Text>
          </View>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
}

function FormCommit({navigation}) {
  // const {signIn} = React.useContext(AuthContext);

  const [slecedList, setSlecedList] = useState([0]);

  const updateSelected = (num) => {
    if (slecedList.includes(num)) {
      slecedList.pop(num);
      setSlecedList([...slecedList]);
    } else {
      slecedList.push(num);
      setSlecedList([...slecedList]);
    }
  };

  return (
    <SafeAreaView
      className="container"
      style={{
        paddingTop: 20,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
      }}>
      <ScrollView>
        <View className="infoBox" style={styles.infoBox}>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              预约时间
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              2020年05月26日10:00-14:00
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              预约编号
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              22
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              预约码
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              0015
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              司机
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              张飞
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              牵引车牌
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              浙BA7564
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              挂车牌
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              浙BA7564
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              车辆荷载
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              50吨
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              本次预约数量
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              30吨
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              押运员
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              张宏
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              采购员
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              潘流程
            </Text>
          </View>
          <View className="infoList" style={styles.infoList}>
            <Text className="key" style={{color: '#666666'}}>
              采购公司
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              福建港祥船务有限公司
            </Text>
          </View>
          <View
            className="infoList"
            style={{...styles.infoList, borderBottomWidth: 0}}>
            <Text className="key" style={{color: '#666666'}}>
              审核人员
            </Text>
            <Text className="value" style={{color: '#666666'}}>
              张红
            </Text>
          </View>
        </View>
        <View className="checkBox" style={styles.checkBox}>
          <TouchableWithoutFeedback onPress={() => updateSelected(0)}>
            <View className="checkList" style={styles.checkList}>
              <Text
                style={{color: slecedList.includes(0) ? '#4c6fe4' : '#666666'}}>
                易燃易爆物品
              </Text>
              <View style={styles.checkListRight}>
                <Text
                  style={{
                    color: slecedList.includes(0) ? '#4c6fe4' : '#666666',
                  }}>
                  合格
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: slecedList.includes(0)
                      ? '#4c6fe4'
                      : '#d9d9d9',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Image
                    style={{width: 15, height: 15}}
                    source={require('./assets/images/gou.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => updateSelected(1)}>
            <View className="checkList" style={styles.checkList}>
              <Text
                style={{color: slecedList.includes(1) ? '#4c6fe4' : '#666666'}}>
                安全帽
              </Text>
              <View style={styles.checkListRight}>
                <Text
                  style={{
                    color: slecedList.includes(1) ? '#4c6fe4' : '#666666',
                  }}>
                  合格
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: slecedList.includes(1)
                      ? '#4c6fe4'
                      : '#d9d9d9',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Image
                    style={{width: 15, height: 15}}
                    source={require('./assets/images/gou.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => updateSelected(2)}>
            <View className="checkList" style={styles.checkList}>
              <Text
                style={{color: slecedList.includes(2) ? '#4c6fe4' : '#666666'}}>
                工作服
              </Text>
              <View style={styles.checkListRight}>
                <Text
                  style={{
                    color: slecedList.includes(2) ? '#4c6fe4' : '#666666',
                  }}>
                  合格
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: slecedList.includes(2)
                      ? '#4c6fe4'
                      : '#d9d9d9',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Image
                    style={{width: 15, height: 15}}
                    source={require('./assets/images/gou.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View className="textInputArea" style={styles.textInputArea}>
          <TextInput
            multiline={true}
            placeholder={'请输入备注内容'}
            // numberOfLines={4}
            // onChangeText={(text) => this.setState({text})}
            // value={this.state.text}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: '#fafafa',
            borderColor: '#e1e1e1',
            borderWidth: 1,
            marginTop: 20,
            marginBottom: 30,
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <Text style={{color: '#eb7059'}}>安检人员</Text>
          <Text style={{color: '#eb7059'}}>张春行</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#666666', fontSize: 18}}>
            安检信息确定通过后提交
          </Text>
          <TouchableHighlight
            style={{
              width: 100 + '%',
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#6089ee',
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={() => {
              // setModalVisible(!modalVisible);
              Alert.alert('提交成功！', '', [
                {text: '确定', onPress: () => navigation.goBack()},
              ]);
            }}>
            <Text style={{fontSize: 18, color: '#fff'}}>确定提交</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [imgSrc, setImgSrc] = useState(null);
  // const [text, setText] = useState('');
  const [carid, setCarid] = useState('');
  const [isOptical, setIsOptical] = useState(false);
  const [isStartTakePic, setIsStartTakePic] = useState(false);

  console.log({navigation});



  const recognize = async (picData) => {
    // const imageTobase64 = await RNFS.readFile(picData['uri'],'base64');
    // console.log({imageTobase64});
    const caridInfo = fetchDataFromServer({
      // image:`data:${image.mime};base64,${image.data}`,
      // image: 'https://imgs.icauto.com.cn/allimg/191210/30-191210094003515.jpg',
      
      image:picData.base64
    }).then((json) => {
      console.log(json);
      setIsOptical(false);
      // modalTool(json.plates[0]['txt']);
      Alert.alert(
        json.words_result['number'],
        '',
        [{text: '确定', onPress: () => {setIsStartTakePic(false);navigation.navigate('FormCommit')}}],
        {cancelable: false},
      );
    });
  };

  const cancelTakePic=()=>{
    setIsStartTakePic(false);
  }

  useEffect(() => {
    // navigation.navigate('FormCommit');
    // accessBaiduToken();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{...styles.container,paddingBottom:40+'%'}}>
        {isOptical && <ActivityIndicatorMod />}
        {isStartTakePic && <Camera 
            callback={(uri) => recognize(uri)} 
            cancelFunc={()=>cancelTakePic()}
        />}
        <View
          className="reservationNumber"
          style={{
            ...styles.reservationNumber,
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TextInput
            placeholder="请输入预约号"
            style={{
              flex: 2,
              height: '100%',
              borderWidth: 1,
              fontSize: 16,
              borderColor: '#d4d2d5',
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
              paddingLeft: 10,
              borderRightWidth: 0,
            }}
          />
          <TouchableHighlight
            style={{
              flex: 1,
              backgroundColor: '#6089ee',
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            }}
            onPress={() => {}}>
            <View style={styles.actBtn}>
              <Image
                style={{width: 20, height: 20, right: 0, marginRight: 5}}
                source={require('./assets/images/searchIcon.png')}
              />
              <Text style={{color: '#fff', fontSize: 16}}>搜索</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View
          className="reservationNumber"
          style={{...styles.reservationNumber, alignItems: 'center'}}>
          <TextInput
            placeholder="请输入车牌号"
            style={{
              flex: 2,
              height: '100%',
              borderWidth: 1,
              fontSize: 16,
              borderColor: '#d4d2d5',
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
              paddingLeft: 10,
              borderRightWidth: 0,
            }}
          />
          <TouchableHighlight
            style={{
              flex: 1,
              backgroundColor: '#6089ee',
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            }}
            onPress={() => {}}>
            <View style={styles.actBtn}>
              <Image
                style={{width: 20, height: 20, right: 0, marginRight: 5}}
                source={require('./assets/images/searchIcon.png')}
              />
              <Text style={{color: '#fff', fontSize: 16}}>搜索</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={{...styles.cameraActBtn, marginBottom: 20, marginTop: 20}}
          onPress={() => {
            // recognizeFromCamera();
            setIsStartTakePic(true);
          }}>
          <Text style={{color: '#fff', fontSize: 16}}>车牌扫描</Text>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
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
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // console.log('123456');

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  const MainStackScreen = () => {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="FormCommit" component={FormCommit} />
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 45,
    borderWidth: 1,
    borderColor: '#d4d2d5',
    marginBottom: 20,
    borderRadius: 50,
    paddingLeft: 10,
  },
  inputArea: {
    paddingLeft: 10,
  },
  loginBtn: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#6089ee',
  },

  //camera
  camera: {
    // position:'absolute',
    // top:0,
    // left:0,
    flex: 1,
    width: 100 + '%',
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  //modal

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  //homepage

  reservationNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 45,
    overflow: 'hidden',
  },
  actBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraActBtn: {
    width: 300,
    height: 45,
    backgroundColor: '#6089ee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //ActivityIndicator
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: 100 + '%',
    height: 100 + '%',
    zIndex: 99,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  //FormCommit
  infoBox: {
    //  width:80+'%',
    //  paddingTop:
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    backgroundColor: '#f9f7fe',
  },
  infoList: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: '#f0eaff',
  },
  checkBox: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fafafa',
  },
  checkList: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: '#e1e1e1',
  },
  checkListRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputArea: {
    borderColor: '#e1e1e1',
    borderWidth: 1,
    height: 200,
  },
});

export default App;
