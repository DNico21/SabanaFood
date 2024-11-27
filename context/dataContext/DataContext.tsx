import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { DefaultResponse, PostProps } from "@/interfaces/postInterface";
import { db } from "@/utils/firebaseConfig";
import { AuthContext } from "../authContext/AuthContext";
import { dataReducer } from "./DataReducer";

export interface MessageProps {
  id?: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date | string;
}

export interface DataState {
  posts: PostProps[]; // Publicaciones asociadas
  messages: MessageProps[]; // Mensajes del chat con estructura definida
}

const dataStateDefault: DataState = {
  posts: [],
  messages: [],
};

interface DataContextProps {
  state: DataState;
  newPost: (newPost: PostProps) => Promise<DefaultResponse>;
  getPosts: (restaurantId: string) => Promise<PostProps[]>;
  sendMessage: (text: string) => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: any) {
  const [state, dispatch] = useReducer(dataReducer, dataStateDefault);
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      console.error("Usuario no autenticado. No se configuran listeners.");
      return;
    }
    const unsubscribeMessages = openMessageListener();
    // Nota: `restaurantId` debe ser proporcionado en el listener para publicaciones específicas.
    return () => {
      unsubscribeMessages();
    };
  }, [user]);

  // Función para escuchar mensajes en tiempo real
  const openMessageListener = () => {
    const messagesRef = collection(db, "messages");
    return onSnapshot(
      messagesRef,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "SET_MESSAGES", payload: messages });
      },
      (error) => console.error("Error fetching messages:", error)
    );
  };

  // Función para escuchar publicaciones en tiempo real para un restaurante específico
  const openPostListener = (restaurantId: string) => {
    if (!restaurantId) return () => {};
    const postsRef = collection(db, "posts");
    const queryRef = query(postsRef, where("restaurantId", "==", restaurantId));
    return onSnapshot(
      queryRef,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "SET_POSTS", payload: posts });
      },
      (error) => console.error("Error fetching posts:", error)
    );
  };

  // Función para enviar un nuevo mensaje
  const sendMessage = async (text: string) => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text,
        senderId: user.uid,
        senderName: `${user.firstname} ${user.lastname}`,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      throw error;
    }
  };

  // Subir imágenes a Firebase Storage
  const uploadImage = async (uri: string): Promise<string> => {
    if (!uri) {
      // Retorna una URL predeterminada o un string vacío si no hay imagen
      return "";
    }
  
    const storage = getStorage();
    const uniqueName = `posts/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, uniqueName);
  
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw error;
    }
  };

  // Obtener publicaciones de un restaurante
  const getPosts = async (restaurantId: string): Promise<PostProps[]> => {
    try {
      const postsRef = collection(db, "posts");
      const queryRef = query(postsRef, where("restaurantId", "==", restaurantId));
      const snapshot = await getDocs(queryRef); // Filtrar publicaciones desde Firebase
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostProps));
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error);
      return [];
    }
  };

  // Crear una nueva publicación
  const newPost = async (newPost: PostProps): Promise<DefaultResponse> => {
    if (!user) return { isSuccess: false, message: "Usuario no autenticado" };
  
    try {
      // Subir imagen solo si el campo `image` no está vacío
      const urlImage = newPost.image ? await uploadImage(newPost.image) : "";
  
      await addDoc(collection(db, "posts"), {
        ...newPost,
        image: urlImage,
        date: serverTimestamp(),
        username: `${user.username}`,
        postedBy: user.uid,
        likes: 0,
        restaurantId: newPost.restaurantId, // Asociar con el restaurante
      });
  
      return { isSuccess: true, message: "Publicación creada con éxito" };
    } catch (error) {
      console.error("Error creando publicación:", error);
      return { isSuccess: false, message: `Error creando publicación: ${error}` };
    }
  };

  return (
    <DataContext.Provider
      value={{
        state,
        newPost,
        getPosts,
        sendMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}