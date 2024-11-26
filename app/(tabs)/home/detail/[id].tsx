//[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { AuthContext } from '@/context/authContext/AuthContext';

export default function ChatDetail() {
  const params = useLocalSearchParams();
  const { id, userName } = params;
  const { state } = useContext(AuthContext);
  const { user } = state; // Usuario actual
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    if (userName) {
      navigation.setOptions({ title: decodeURIComponent(userName as string) });
    } else {
      // Si no se pasa userName, obtenerlo de la base de datos
      const fetchUserName = async () => {
        const userDoc = await getDoc(doc(db, 'Users', id as string));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const fullName = `${userData.firstname} ${userData.lastname}`;
          setRecipientName(fullName);
          navigation.setOptions({ title: fullName });
        }
      };
      fetchUserName();
    }
  }, [userName, id, navigation]);

  // Crea un chat unico dependiendo del usuario logueado y al que se quiere escribir
  const chatId = [user.uid, id].sort().join('_');

  // Real-time message listener
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      chatId: chatId, 
      senderId: user.uid,
      senderName: `${user.firstname} ${user.lastname}`,
      text: newMessage,
      timestamp: new Date(),
    };

    await addDoc(collection(db, 'messages'), messageData);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === user.uid ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.senderName}>{item.senderName}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Input field to write a new message */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 16,
  },
  senderName: {
    fontSize: 12,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
  },
});
