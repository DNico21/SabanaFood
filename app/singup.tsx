//singup.tsx
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { Link, router } from "expo-router";
import { AuthContext } from "@/context/authContext/AuthContext";

export default function SignUp() {
  const { signUp, signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleSignUp = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
    return;
  }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    const response = await signUp(email, password, firstname, lastname);
    if (response) {
      Alert.alert("Éxito", "Cuenta creada con éxito");

      // Iniciar sesión automáticamente
      const loginResponse = await signIn(email, password);
      if (loginResponse) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", "Hubo un error al iniciar sesión");
      }
    } else {
      Alert.alert("Error", "Hubo un error creando la cuenta");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Registro</Text>
      </View>

      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail} // Actualiza el estado con el valor de email
        />
      </View>

      {/* Campo de Nombre */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Nombre"
          style={styles.input}
          value={firstname}
          onChangeText={setFirstname} // Actualiza el estado con el valor de email
        />
      </View>

      {/* Campo de Nombre */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Apellido"
          style={styles.input}
          value={lastname}
          onChangeText={setLastname} // Actualiza el estado con el valor de email
        />
      </View>

      {/* Campo de Contraseña */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Contraseña"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword} // Actualiza el estado con el valor de password
        />
      </View>

      {/* Confirmar Contraseña */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Confirmar Contraseña"
          secureTextEntry={true}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword} // Actualiza el estado con el valor de confirmPassword
        />
      </View>

      {/* Botón de Registro */}
      <View style={styles.buttonContainer}>
        <Button title="Registrar" onPress={handleSignUp} />
      </View>

      {/* Enlace a la página de inicio de sesión */}
      <View style={styles.linkContainer}>
        <Link href="/singin">
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  inputContainer: {
    marginVertical: 10,
    width: "80%",
  },
  input: {
    padding: 10,
    paddingHorizontal: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
