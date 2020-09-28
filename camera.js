


import React, { PureComponent } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

class Camera extends PureComponent {


  componentDidMount(){
        console.log(this.props);
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
        //   flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        //   androidRecordAudioPermissionOptions={{
        //     title: 'Permission to use audio recording',
        //     message: 'We need your permission to use your audio',
        //     buttonPositive: 'Ok',
        //     buttonNegative: 'Cancel',
        //   }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={{...styles.capture,backgroundColor:'#6089ee'}}>
            <Text style={{ fontSize: 14,color:'#fff' }}>开始识别</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.cancelTakePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.4, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log({'拍照信息':data});
      if(this.props.callback){
        this.props.callback(data);
      }
    }
  };

  cancelTakePicture=()=>{
    if(this.props.cancelFunc){
        this.props.cancelFunc();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    top:0,
    left:0,
    flex: 1,
    width:100+'%',
    height:100+'%',
    zIndex:99,
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
});


export default Camera;