import {Alert} from 'react-native';

const commitForm = () => {
  //提交登录表单
};

const commitCheckForm = () => {
  //提交检查表单数据
};

const getMoviesFromApi = () => {
  return fetch('https://reactnative.dev/movies.json')
    .then((response) => response.json())
    .then((json) => {
      console.log({movie: json});
      return json.movies;
    })
    .catch((error) => {
      console.error(error);
    });
};

const accessBaiduToken = () => {
  return fetch(
    'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=WKzM2XshcpY7pHc4lkt6uw4b&client_secret=8IlnLuBgdBYGT56pQU1HCxvcl3NGbzp1',
    {
      method: 'POST',
    },
  )
    .then((response) => {
      console.log({accessBaiduToken_response: response});
      return response.json();
    })
    .then((json) => {
      console.log({accessBaiduToken: json});
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};

const fetchDataFromServer = async (param) => {
  //车牌识别服务端获取数据

  const {image, configure} = param;
  // const formData = new FormData();
  // formData.append('image', image);
  // formData.append('multi_detect', true);

  let details = {
    image: encodeURIComponent(image)
  };

  let formBody = [];
  for (let property in details) {
    let encodedKey = property;
    let encodedValue = details[property];
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  try {
    console.log('try');
    let response = await fetch(
      'https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=24.ffc1230088323c6f0dc9e2efa8ac608f.2592000.1603851764.282335-22748175',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', //multipart/form-data;
        },
        body: formBody,
      },
    );

    console.log({response: response});
    if (response.ok) {
      let json = await response.json();
      console.log({车牌信息: json});
      return json;
    } else {
      Alert.alert(
        '识别错误',
        '识别的是图片中不包含车牌',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  commitForm,
  commitCheckForm,
  fetchDataFromServer,
  getMoviesFromApi,
  accessBaiduToken,
};
