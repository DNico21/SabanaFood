//DataContext.tsx
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { dataReducer } from "./DataReducer";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { DefaultResponse, PostProps } from "@/interfaces/postInterface";
import { addDoc, collection, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { AuthContext } from "../authContext/AuthContext";

export interface DataState {
  messages: any[]; // Estado para mensajes del chat
}

const dataStateDefault: DataState = {
  messages: [],
};

interface DataContextProps {
  state: DataState;
  newPost: (newPost: PostProps) => Promise<DefaultResponse>;
  getPosts: () => Promise<PostProps[]>;
  sendMessage: (text: string) => Promise<void>; // Nueva función para enviar mensajes
}

export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: any) {
  const [state, dispatch] = useReducer(dataReducer, dataStateDefault);
  const [messages, setMessages] = useState<any[]>([]); // Nuevo estado para mensajes
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = openListener(); // Escuchar los mensajes en tiempo real
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Función para escuchar mensajes en tiempo real
  const openListener = () => {
    const messagesRef = collection(db, "messages");
    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return unsubscribe;
  };

  // Función para enviar un nuevo mensaje
  const sendMessage = async (text: string) => {
    if (!user) return;

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text,
        senderId: user.uid,
        senderName: `${user.firstname} ${user.lastname}`,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, "posts");

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const getPosts = async (): Promise<PostProps[]> => {
    try {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);
      const posts = snapshot.docs.map((doc) => doc.data() as PostProps);
      return posts;
    } catch (error) {
      console.log("Error obteniendo posts: ", error);
      return [];
    }
  };

  const newPost = async (newPost: PostProps): Promise<DefaultResponse> => {
    try {
      const urlImage = await uploadImage(newPost.image);
      const docRef = await addDoc(collection(db, "posts"), {
        ...newPost,
        image: urlImage,
        date: new Date(),
        username: `${user.firstname} ${user.lastname}`,
        postedBy: user.uid,
        likes: 0,
      });

      return {
        isSuccess: true,
        message: "Creado con éxito",
      };
    } catch (error) {
      console.log(error);
      return {
        isSuccess: false,
        message: "Hubo un error: " + error,
      };
    }
  };

  return (
    <DataContext.Provider
      value={{
        state: { ...state, messages },
        newPost,
        getPosts,
        sendMessage, // Proveer la función de enviar mensaje
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
