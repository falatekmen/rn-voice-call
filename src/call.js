import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Image,
    BackHandler
} from 'react-native';
import RtcEngine from 'react-native-agora';
import {
    EventType,
    useZoom,
    ZoomVideoSdkUser,
    Errors,
} from '@zoom/react-native-videosdk';
import { navigate } from './customNavigator';
import { icons } from './assets';
import { units, fonts } from './theme';


export function CallScreen({ extraData, navigation }) {

    const { params } = extraData
    const zoom = useZoom();

    const [isInSession, setIsInSession] = useState(false); // only for zoom
    const [engine, setEngine] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);

    const agoraInit = async () => {
        setEngine(await RtcEngine.create(params.appId));
    };

    const zoomInit = () => {
        setEngine("zoom")
    }

    const callInit = () => {
        if (params.sdk == "agora") {
            agoraInit()
        } else {
            zoomInit()
        }
    };

    const agoraStart = async () => {
        await engine.joinChannel(
            params.token,
            params.channel,
            null,
            0,
        )
        engine.addListener('UserOffline', async () => {
            agoraEnd();
        });
    };

    const zoomStart = async () => {
        await zoom.joinSession({
            sessionName: params.channel,
            sessionPassword: "",
            token: params.token,
            userName: "attendee",
            audioOptions: {
                connect: true,
                mute: false,
            },
            videoOptions: {
                localVideoOn: false,
            },
            sessionIdleTimeoutMins: 60,
        });

        zoom.addListener(
            EventType.onSessionJoin,
            async () => {
                setIsInSession(true);
                const mySelf = await zoom.session.getMySelf();
                zoom.audioHelper.setSpeaker(false);
                zoom.audioHelper.unmuteAudio(mySelf.userId);
            }
        );

        zoom.addListener(
            EventType.onSessionLeave,
            zoomEnd
        );

        zoom.addListener(
            EventType.onUserAudioStatusChanged,
            async () => {
                const mySelf = new ZoomVideoSdkUser(
                    await zoom.session.getMySelf()
                );
                mySelf.audioStatus.isMuted().then((muted) => setIsMuted(muted));
            }
        );

        zoom.addListener(
            EventType.onError,
            async (error) => {
                console.log('Error: ' + JSON.stringify(error));
                switch (error.errorType) {
                    case Errors.SessionJoinFailed:
                        Alert.alert('Failed to start the call');
                        setTimeout(() => navigate(params.mainScreen), 1000);
                        break;
                    default:
                }
            }
        );
    }

    const callStart = () => {
        if (params.sdk == "agora") {
            agoraStart()
        } else {
            zoomStart()
        }
    };

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            callInit();
            isInitialMount.current = false;
        } else {
            callStart();
        }
    }, [engine]);

    const toggleAgoraMicrophone = async () => {
        await engine.muteLocalAudioStream(!isMuted)
            .then(() => setIsMuted(!isMuted));
    }

    const toggleZoomMicrophone = async () => {
        const mySelf = await zoom.session.getMySelf();
        isMuted
            ? zoom.audioHelper.unmuteAudio(mySelf.userId)
                .then(() => setIsMuted(false))
            : zoom.audioHelper.muteAudio(mySelf.userId)
                .then(() => setIsMuted(true))
    }

    const toggleMicrophone = async () => {
        if (params.sdk == "agora") {
            toggleAgoraMicrophone()
        } else {
            toggleZoomMicrophone()
        }
    };

    const toggleAgoraSpeaker = async () => {
        await engine.setEnableSpeakerphone(!isSpeakerOn)
            .then(() => setIsSpeakerOn(!isSpeakerOn));
    }

    const toggleZoomSpeaker = async () => {
        zoom.audioHelper.setSpeaker(!isSpeakerOn)
            .then(() => setIsSpeakerOn(!isSpeakerOn))
    }

    const toggleSpeaker = async () => {
        if (params.sdk == "agora") {
            toggleAgoraSpeaker()
        } else {
            toggleZoomSpeaker()
        }
    };

    const agoraEnd = async () => {
        await engine.leaveChannel()
        await engine.destroy()
        navigation.pop()
        navigate(params.mainScreen);
    }

    const zoomEnd = async () => {
        setIsInSession(false);
        zoom.leaveSession(false);
        navigation.pop()
        navigate(params.mainScreen);
    }

    const endCall = async () => {
        if (params.sdk == "agora") {
            agoraEnd()
        } else {
            zoomEnd()
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                return true
            })
        return () => backHandler.remove()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <Text style={styles.callerText}>
                {params.callerName}
            </Text>
            <View style={styles.iconsWrapper}>
                <TouchableOpacity onPress={toggleMicrophone}>
                    <Image
                        source={isMuted ? icons.unmute : icons.mute}
                        style={styles.smallIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={endCall}>
                    <Image
                        source={icons.endCall}
                        style={styles.largeIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSpeaker}>
                    <Image
                        source={isSpeakerOn ? icons.speakerOff : icons.speakerOn}
                        style={styles.smallIcon}
                    />
                </TouchableOpacity>
            </View>
            {params.sdk == "zoom" && !isInSession ?
                <View style={styles.connectingWrapper}>
                    <Text style={styles.connectingText}>Connecting...</Text>
                </View>
                :
                null
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    callerText: {
        flex: 3,
        fontSize: fonts(36),
        marginTop: units.height / 18,
        alignSelf: 'center',
        color: '#333333'
    },
    iconsWrapper: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
    },
    smallIcon: {
        height: units.height / 11,
        width: units.height / 11
    },
    largeIcon: {
        height: units.height / 9,
        width: units.height / 9,
    },
    connectingWrapper: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    connectingText: {
        fontSize: fonts(24),
        fontWeight: 'bold',
        color: '#000000'
    }
});
