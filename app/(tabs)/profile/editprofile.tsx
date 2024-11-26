import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";
import { updateEmail, updatePassword } from "firebase/auth";
import { AuthContext } from "@/context/authContext/AuthContext";
import * as ImagePicker from 'expo-image-picker'; // Importar Image Picker
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importar Firebase Storage

export default function EditProfile() {
  const { state, updateUser } = useContext(AuthContext);
  const { user } = state;

  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(user?.profileImage || ""); // Nuevo estado para la imagen de perfil
  const [isUploading, setIsUploading] = useState(false); // Estado para manejar la carga de la imagen

  // Función para seleccionar imagen de perfil
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri); // Guardar la URI de la imagen seleccionada
    }
  };

  // Función para subir la imagen a Firebase Storage y obtener la URL
  const uploadImageToStorage = async (uri: string) => {
    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${user.uid}.jpg`); // Usar el uid del usuario como nombre de la imagen

    const response = await fetch(uri);
    const blob = await response.blob(); // Convertir la imagen en blob para subirla

    await uploadBytes(storageRef, blob); // Subir la imagen a Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Obtener la URL de la imagen subida

    setIsUploading(false);
    return downloadURL;
  };

  // Función para actualizar la información en Firebase
  const handleSave = async () => {
    if (!firstname || !lastname || !email) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }

      let updatedProfileImage = profileImage;

      // Subir imagen si se seleccionó una nueva
      if (profileImage && profileImage !== user?.profileImage) {
        updatedProfileImage = await uploadImageToStorage(profileImage);
      }

      const userRef = doc(db, "Users", user.uid);

      // Actualizar Firestore (nombre, apellido e imagen de perfil)
      await updateDoc(userRef, {
        firstname,
        lastname,
        profileImage: updatedProfileImage, // Guardar la URL de la imagen en Firestore
      });

      // Actualizar Authentication (email y contraseña)
      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
      }

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      // Actualizar el contexto con los nuevos valores
      updateUser({ firstname, lastname, email, profileImage: updatedProfileImage });

      Alert.alert("Perfil actualizado con éxito");
    } catch (error: unknown) {
      console.log(error);

      const errorMessage =
        (error as Error).message || "Ocurrió un error desconocido";
      Alert.alert("Error al actualizar el perfil", errorMessage);
    }
  };

  // Aquí va el return que renderiza el componente
  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profileImage ? { uri: profileImage } : require("@/assets/images/adaptive-icon.png")} // Imagen por defecto si no hay imagen seleccionada
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View>
        <TextInput
          value={firstname}
          onChangeText={setFirstname}
          placeholder="Nombre"
          style={styles.input}
        />
      </View>
      <TextInput
        value={lastname}
        onChangeText={setLastname}
        placeholder="Apellido"
        style={styles.input}
      />
      <Button title="Guardar Cambios" onPress={handleSave} disabled={isUploading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 350, // Ajustar el ancho del input
    textAlign: "left", // Centrar el texto dentro del input
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Hace que la imagen sea circular
    marginBottom: 20,
  },
});
