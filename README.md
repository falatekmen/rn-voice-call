# React Native Voice Call

Package to <ins>receive</ins> voice calls in React Native using Zoom Video SDK and Agora React Native SDK.

<img width="300" alt="image" src="https://user-images.githubusercontent.com/81239267/163897972-3c738f39-cb1d-474c-9505-2ca344f14013.png">

# Installation
Install `rn-voice-call`:

    npm install rn-voice-call

Go to your ios folder and run:

    pod install

# A) Zoom Integration

## Download Zoom Video SDK

1- Create a [Zoom Account](https://zoom.us/buy/videosdk).

2- Login to [Zoom Developer Platform](https://developers.zoom.us) and then click [Build App](https://marketplace.zoom.us/develop/create).

3- Click "View Here" on the page that opens and enter the company name in the information tab.

<img width="225" alt="image" src="https://user-images.githubusercontent.com/81239267/158472724-284763be-6bf3-4490-a140-6a725c46ba72.png">

<img width="450" alt="image" src="https://user-images.githubusercontent.com/81239267/164952949-7f811af4-53de-4037-9de0-2b001b1c6aae.png">

4- Download Android and iOS SDK packages in the download tab. These will be used to integrate the SDK into the application.

<img width="550" alt="image" src="https://user-images.githubusercontent.com/81239267/158473934-4f64f6f7-61c4-4a95-a346-6014ffa0317e.png">

## Zoom SDK Integration

Install the React Native Video SDK in your project.

    npm install @zoom/react-native-videosdk
    
Go to your ios folder and run:

    pod install

After package installation, the app will give an error. Since the React Native package is a wrapper, you must then add the iOS and/or Android Video SDK to your project so the wrapper can access it.

### Android

1- Copy the mobilertc folder in the Sample&Libs/mobilertc-android/ directory of the downloaded library to the android folder in your project.

<img width="550" alt="image" src="https://user-images.githubusercontent.com/81239267/164976184-082d12d3-e6a3-42a7-9c92-79597a8e6e20.png">

2- Open android/settings.gradle and include mobilertc in the project.

<img width="550" alt="image" src="https://user-images.githubusercontent.com/81239267/164953379-9453b932-f56d-4b3a-85c0-e4a90d918c73.png">

3- In android/app/build.gradle add mobilertc as a dependency for the project.

    dependencies {
        // Add these
        implementation 'androidx.security:security-crypto:1.1.0-alpha02'
        implementation 'com.google.crypto.tink:tink-android:1.5.0'
        implementation 'androidx.appcompat:appcompat:1.0.0'
        implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
        implementation 'androidx.recyclerview:recyclerview:1.0.0'
        implementation 'androidx.legacy:legacy-support-v4:1.0.0'
        implementation 'com.github.chrisbanes:PhotoView:2.3.0'
        implementation project(':mobilertc')
        ...
    }

4- Add the following to the android section of android/app/build.gradle.

    android {
        // Add this
        packagingOptions {
             pickFirst '**/*.so'
         }
        ...
    }
    
5- Add required permission to the android/app/src/main/AndroidManifest.xml

    <uses-permission android:name="android.permission.RECORD_AUDIO" />

#### Android Troubleshooting

<b>1- The Error Log:</b> `zoom_react-native-videosdk:compileDebugJavaWithJavac`

<img width="550" alt="image" src="https://user-images.githubusercontent.com/81239267/158476423-0a5384f8-7cb8-4ed8-aa27-ac4bf7551c6c.png">

Add the following to the node_modules/@zoom/react-native-videosdk/android/src/main/java/com/reactnativezoomvideosdk/RNZoomVideoSdkModule.java

    // Import these
    import us.zoom.sdk.ZoomVideoSDKPhoneFailedReason;
    import us.zoom.sdk.ZoomVideoSDKPhoneStatus;

    public class RNZoomVideoSdkModule extends ReactContextBaseJavaModule implements ZoomVideoSDKDelegate, LifecycleEventListener {
    
      // Add this
      @Override
      public void onInviteByPhoneStatus(ZoomVideoSDKPhoneStatus zoomVideoSDKPhoneStatus, ZoomVideoSDKPhoneFailedReason zoomVideoSDKPhoneFailedReason) { 
      }
    ...
    }

<b>2- The Error Log:</b> `java.lang.OutOfMemoryError`

<img width="750" alt="image" src="https://user-images.githubusercontent.com/81239267/158477462-e3e7ecf9-f47d-4314-936b-201ab31b3b05.png">

Add the following to the android/gradle.properties.

    org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=4096m -XX:+HeapDumpOnOutOfMemoryError
    org.gradle.daemon=true
    org.gradle.parallel=true
    org.gradle.configureondemand=true

### iOS

1- Open your project in Xcode and select the current target. Set iOS deployment target to iOS 8.0 or later.

<img width="730" alt="image" src="https://user-images.githubusercontent.com/81239267/164953645-5df45fec-e41a-4da9-845b-4d544202c2fb.png">

2- Copy the ZoomVideoSDK.xcframework in the Sample&Libs/libs directory of the downloaded library into your Xcode project folder.

<img width="500" alt="image" src="https://user-images.githubusercontent.com/81239267/164953791-23ca8271-5a59-4c8c-858b-f84c62e3c8c6.png">

<img width="500" alt="image" src="https://user-images.githubusercontent.com/81239267/164953918-d7b8a0e7-ad0e-4213-8f99-11bbb059638f.png">

3- Include the iOS Video SDK in the project by clicking the + button under the Embedded Binaries.

<img width="800" alt="image" src="https://user-images.githubusercontent.com/81239267/164981399-680879f9-ac1f-4656-9f90-5353dbd6e3eb.png">

4- Add required permission to the Info.plist

    <key>NSMicrophoneUsageDescription</key>
    <string></string>
    
5- Set "Enable Bitcode" in Build Settings > Build Options to No

<img width="800" alt="image" src="https://user-images.githubusercontent.com/81239267/164954161-05cbffb7-139b-492a-8be4-29560663c6f6.png">

For more information: [Zoom.us](https://marketplace.zoom.us/docs/sdk/video/react-native/getting-started)

# B) Agora Integration

In your React Native project, install the Agora React Native SDK.

    npm install react-native-agora
    
Go to your ios folder and run:

    pod install

The Agora React Native SDK uses Swift in native modules, and therefore your project must support compiling Swift. Otherwise, you will get errors when building the iOS app.

 1- Open the project with Xcode.

    cd ios
    open ProjectName.xcworkspace

 2- Click File > New > File.

<img width="450" alt="image" src="https://user-images.githubusercontent.com/81239267/164997855-9fa418bd-f902-4092-b269-eb61d161d787.png">

Select iOS > Swift File, and then click Next > Create to create a new File.swift file.

<img width="450" alt="image" src="https://user-images.githubusercontent.com/81239267/164997976-6b6af309-1dda-471d-b8d2-d9c6b536ff69.png">
<img width="450" alt="image" src="https://user-images.githubusercontent.com/81239267/164997962-f3f3f538-5da4-456f-b933-e88a0ee8170b.png">

For more information: [Agora.io](https://docs.agora.io/en/Voice/start_call_audio_react_native?platform=React%20Native)

# Usage

`Note:` Don't forget to ask for microphone permission at runtime before the call starts. You can use the [react-native-permissions](https://www.npmjs.com/package/react-native-permissions) package for this. In addition, the application must have [navigation](https://reactnavigation.org) installed.

1- For Zoom SDK wrap your application with `ZoomVideoSdkProvider` and set the required configuration properties. You don't need to do anything for Agora.

<img width="525" alt="image" src="https://user-images.githubusercontent.com/81239267/164570750-f997f0ce-7a10-42f4-8c76-07b142a897b0.png">

2- Import the `VoiceCall` and `navigationRef` from the package to the main navigation. Add `VoiceCall` as a component to the navigator and add `navigationRef` as a ref to the NavigationContainer.

<img width="525" alt="image" src="https://user-images.githubusercontent.com/81239267/164570990-249aef68-f8f6-46a4-b7ba-8b6b9297896a.png">

3- You can receive Zoom or Agora calls from any screen. Specify a screen and import the `navigate` from the package and get the necessary parameters for Zoom or Agora with a notification on that screen. Send the parameters to the `VoiceCall` component with the `params` key.

<img width="550" alt="image" src="https://user-images.githubusercontent.com/81239267/164575303-362894c5-6e39-46b9-b99d-c680ce6609d6.png">

Send the following parameters for Agora or Zoom to your application with a notification:

`callerName`: The name that will appear on the screen when the call starts.

`token`: Token generated by the initiator of the Zoom Meeting or Agora Token.

`channel`: Zoom session name specified by the Zoom Meeting initiator, or Agora channel name specified when generating the Agora token.

`appId`: Agora App ID. Can be blank if this is a Zoom call.

`mainScreen`: Any screen name in the navigation to return to after completing the call.

`sdk`: This has to be "zoom" if it's a Zoom call and "agora" if it's an Agora call.

# Testing the package

You can use [ZoomHost](https://github.com/falatekmen/ZoomHost) and [AgoraCall](https://github.com/falatekmen/AgoraCall) apps to test your app. With both applications, you can initiate a call and get the necessary parameters for the package.