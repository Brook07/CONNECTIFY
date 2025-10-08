import 'react-native-get-random-values';
import { Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";


import SimpleEmojiPicker from './hooks/SimpleEmojiPicker'; // Adjust path as needed
import useGetUserID from "./hooks/useGetUserID";
import CryptoJS from "crypto-js";

import { v4 as uuidv4 } from 'uuid';
import io from "socket.io-client";
import { BASE_URL } from "../config/config"; // adjust the path as needed
const socket = io(`${BASE_URL}`);  // Localhost for Android emulator



const ChatMessagesScreen = () => {
  const { chatId } = useLocalSearchParams();
  const [receiverId, setReceiverId]= useState(null);
  const [chat, setChat]= useState(null);
  const { userId: userId, loading: idLoading } = useGetUserID();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [loading, setLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
const SHARED_SECRET_KEY = "supersecretkey123";
    const [messageToDelete, setMessageToDelete] = useState(null);
   // const uuidv4 = () => Math.random().toString(36).substring(2, 15);




// custom user effect to retrieve the message recipient's id.
useEffect(()=>{
  if (!chatId) return;
  setLoading(true);
  fetch(`${BASE_URL}/chat/${chatId}/recipientId`)
          .then((res) => res.json())
          .then((data) => {
            
            setChat(data);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));

}, [chatId]);

useEffect(()=>{
  if (!chat) return;

  const id= chat.user1_id === userId ? chat.user2_id : chat.user1_id;
  setReceiverId(id);
}, [chat, userId]);


    // Fetch all message requests and filter out self
      useEffect(() => {
        if (!userId) return;
    
        setLoading(true);
        fetch(`${BASE_URL}/chat/${chatId}/messages`)
          .then((res) => res.json())
          .then((data) => {
            
            setMessages(data);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }, [userId]);

      useEffect(() => {
  if (!chatId || !userId) return;

  socket.emit("joinRoom", chatId);

  socket.on("receiveMessage", (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
     setTimeout(() => scrollToBottom(), 100); // Ensures auto-scroll after render
  });

  socket.on("messageDeleted", ({ messageId }) => {
  setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
});


  return () => {
    socket.off("receiveMessage");
    socket.off("receiveMessage");
  socket.off("messageDeleted");
  };
}, [chatId, userId]);

//const receiverId = chat.user1_id === userId ? chat.user2_id : chat.user1_id;

////////
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

//const receiverId = chat.user1_id === userId ? chat.user2_id : chat.user1_id;
// id: result 

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  const message= 'Photo file(s) are received.'
  const encryptedText = CryptoJS.AES.encrypt(message, SHARED_SECRET_KEY).toString();
  if (!result.canceled) {
    const newImageMessage = {
      _id: uuidv4(),
      messageType: "image",
      message:encryptedText,
      imageUrl: result.uri,
      timeStamp: new Date(),
      senderId: userId,
      chatId: chatId,
    };

    socket.emit("sendMessage", newImageMessage);
    setMessages((prev) => [...prev, newImageMessage]);
  }
};



const handleSend = () => {
  if (!message.trim()) return;

  const encryptedText = CryptoJS.AES.encrypt(message, SHARED_SECRET_KEY).toString();


  const newMessage = {
    _id: uuidv4(),
    messageType: "text",
    message: encryptedText,
   
    timeStamp: new Date(),
    senderId: userId,
    chatId: chatId,
    receiverId
  };

  socket.emit("sendMessage", newMessage);
  //setMessages((prev) => [...prev, newMessage]);
  setMessage("");
  scrollToBottom();
};


  const handleSelectMessage = (msg) => {
  if (selectedMessages.includes(msg._id)) {
    setSelectedMessages([]);
  } else {
    setSelectedMessages([msg._id]);
  }};


  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <Pressable
  onPress={() => {
    if (messageToDelete) setMessageToDelete(null);
  }}
  style={{ flex: 1 }}
>

      <ScrollView
      style={{paddingTop:25}}
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          const isSelected = selectedMessages.includes(item._id);
          const isSelf = item.sender_id === userId;
         
          if (item.message_type === "text") {
            const decryptedMessage = CryptoJS.AES.decrypt(item.message, SHARED_SECRET_KEY).toString(CryptoJS.enc.Utf8);
            return (
              <Pressable
                key={index}
                onLongPress={() => setMessageToDelete(item)}
                style={[
                  {
                    alignSelf: isSelf ? "flex-end" : "flex-start",
                    backgroundColor: isSelf ? "#DCF8C6" : "white",
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {decryptedMessage}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timestamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.message_type === "image") {
            return (
              <Pressable
                key={index}
                style={{
                  alignSelf: isSelf ? "flex-end" : "flex-start",
                  backgroundColor: isSelf ? "#DCF8C6" : "white",
                  padding: 8,
                  margin: 10,
                  borderRadius: 7,
                  maxWidth: "60%",
                }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: 200, height: 200, borderRadius: 7 }}
                />
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    position: "absolute",
                    right: 10,
                    bottom: 7,
                    color: "white",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timestamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={handleSend}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

{showEmojiSelector && (
  <SimpleEmojiPicker
    onEmojiSelected={(emoji) => {
      setMessage((prev) => prev + emoji);
    }}
  />
)}







{messageToDelete!= null && (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#ccc",
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    <Pressable
    
      onPress={async () => {
        // Delete each selected message
        const messageId = messageToDelete.id;
        socket.emit("deleteMessage", { messageId, chatId });

       // setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        //setSelectedMessages([]);
        setMessageToDelete(null);
      }}
    >
      <Feather name="trash-2" size={24} color="red" />
    </Pressable>
  </View>
)}





    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
