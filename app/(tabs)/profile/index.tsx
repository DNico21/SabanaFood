import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/context/authContext/AuthContext";

export default function Profile() {
  const { state, updateUser } = useContext(AuthContext); // Función para actualizar el usuario
  const { firstname, lastname, email, profileImage } = state.user || {
    firstname: "",
    lastname: "",
    email: "",
    profileImage: "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname,
    lastname,
    email,
    profileImage,
  });

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Seleccionar imagen desde la galería
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri }); // Actualizar la imagen
    }
  };

  // Guardar cambios
  const handleSave = () => {
    if (!formData.firstname || !formData.lastname || !formData.email) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    updateUser(formData); // Actualiza los datos en el contexto
    setIsEditing(false); // Salir del modo de edición
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              formData.profileImage
                ? { uri: formData.profileImage }
                : require("@/assets/images/adaptive-icon.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.photoHint}>Toca la foto para cambiarla</Text>
      </View>

      {/* Vista o edición de datos */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={formData.firstname}
            onChangeText={(value) => handleInputChange("firstname", value)}
            placeholder="Nombre"
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={formData.lastname}
            onChangeText={(value) => handleInputChange("lastname", value)}
            placeholder="Apellido"
          />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
          />

          {/* Botón para guardar cambios */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          {/* Botón para cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.viewContainer}>
          <Text style={styles.nameText}>
            {firstname} {lastname}
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  photoHint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  editContainer: {
    width: "100%",
  },
  viewContainer: {
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});