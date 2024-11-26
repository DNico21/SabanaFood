//AuthContext.tsx
import { createContext, useEffect, useReducer } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig";
import { authReducer } from "./AuthReducer";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AuthState {
  user?: any;
}

const authStateDefault = {
  user: undefined,
};

interface AuthContextProps {
  state: AuthState;
  signUp: (
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  updateUser: (updatedUser: any) => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: any) {
  const [state, dispatch] = useReducer(authReducer, authStateDefault);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Al detectar un usuario logueado, cargar sus datos desde Firestore
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch({ type: "login", payload: { ...user, ...userData } });
        } else {
          dispatch({ type: "login", payload: user });
        }
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener los datos adicionales del usuario desde Firestore
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Almacenar los datos del usuario en el estado
        dispatch({ type: "login", payload: { ...user, ...userData } });
        return true;
      } else {
        console.log("No such document!");
        return false;
      }
    } catch (error: any) {
      console.log("Error: ", error.message);
      return false;
    }
  };



  const updateUser = async (updatedUser: any) => {
    try {
      // Verifica si el usuario está autenticado
      if (!auth.currentUser) {
        throw new Error("No hay un usuario autenticado");
      }
      const userRef = doc(db, "Users", auth.currentUser.uid); // Solo se ejecutará si hay un usuario autenticado
      await setDoc(userRef, updatedUser, { merge: true }); // Actualiza los datos del usuario en Firestore
      dispatch({ type: "updateUser", payload: updatedUser }); // Actualiza el estado en el contexto
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };


  
  const signUp = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Promise<boolean> => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;
      const uid = user.uid;

      // Guardar los datos adicionales del usuario en Firestore
      await setDoc(doc(db, "Users", uid), {
        firstname,
        lastname,
        email,
      });

      // Almacenar los datos del usuario en el estado
      dispatch({ type: "login", payload: { uid, email, firstname, lastname } });

      return true;
    } catch (error: any) {
      console.log("Error: ", error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signIn,
        signUp,
        updateUser, // Aquí exponemos la función para que otros componentes puedan usarla
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
