import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
} from 'react-native';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from './env';

const avatarBot = require('./assets/images/avatar.png');
const iconSend = require('./assets/images/sendicon.png');

const BOT = {
  _id: 2,
  name: 'Mr. Bot',
  avatar: avatarBot,
};

export class App extends Component {
  state = {
    keyboardStatus: undefined,
    messages: [
      {
        _id: 1,
        text: 'Hi my name is Mr.Robot',
        createdAt: new Date(),
        user: BOT,
      },
    ],
    id: 1,
    name: '',
  };

  componentDidMount = () => {
    this.keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({keyboardStatus: 'Keyboard Shown'});
      },
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({keyboardStatus: 'Keyboard Hidden'});
      },
    );

    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  };

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  handleGoogleResponse = result => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  };

  sendBotResponse = text => {
    let msg;
    if (text == 'senyum') {
      msg = {
        _id: this.state.messages.length + 1,
        text: `Jangan lupa ${text} hari ini`,
        image:
          'https://scontent-sin6-4.xx.fbcdn.net/v/t1.18169-9/11205049_431366110393571_8723182005016167723_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeHZ2EaXLLAKme75s1BnKOLbq7yJaFD-lRqrvIloUP6VGokAE5B4ZgfInqA_LtcmFuoY7z-kdF7H7rrQTgjqYEzg&_nc_ohc=nAshzIZway0AX8Hx7zq&_nc_ht=scontent-sin6-4.xx&oh=b0a9e16574131bf37826058f4753029a&oe=61585B01',
        createdAt: new Date(),
        user: BOT,
      };
    } else {
      msg = {
        _id: this.state.messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT,
      };
    }

    this.setState(previouseState => ({
      messages: GiftedChat.append(this.state.messages, [msg]),
    }));
  };

  onSend = (messages = []) => {
    this.setState(previouseState => ({
      messages: GiftedChat.append(previouseState.messages, messages),
    }));
    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  };

  onQuickReply = quickReply => {
    this.setState(previouseState => ({
      messages: GiftedChat.append(previouseState.messages, quickReply),
    }));
    console.log(quickReply[0]);
    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: 50,
            width: '100%',
            backgroundColor: 'lightblue',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Chat Bot</Text>
        </View>
        <GiftedChat
          isCustomViewBottom={true}
          alwaysShowSend={true}
          alignTop
          renderSend={props => {
            return (
              <Send {...props}>
                <View style={{marginHorizontal: 10, marginTop: 10}}>
                  <Image source={iconSend} style={{height: 40, width: 40}} />
                </View>
              </Send>
            );
          }}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                {...props}
                style={{backgroundColor: 'red', marginTop: 15}}
                containerStyle={{
                  marginHorizontal: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: 'lightblue',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            );
          }}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onQuickReply={quickReply => this.onQuickReply(quickReply)}
          user={{_id: 1}}
        />
      </SafeAreaView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {flex: 1},
});
