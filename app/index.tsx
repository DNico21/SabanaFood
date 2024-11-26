//index.tsx
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Instagram</Text>

      <Image
        source={require("../assets/images/logo-instagram-color.png")} // Usar require para imágenes locales
        style={styles.image}
      />

      {/* Contenedor para el botón de Iniciar Sesión */}
      <View style={styles.buttonContainer}>
        <Link href={"/singin"} asChild>
          <Button title="Iniciar Sesión" color="#3897f0" />
        </Link>
      </View>

      {/* Contenedor para el botón de Registrarse */}
      <View style={styles.buttonContainer}>
        <Link href={"/singup"} asChild>
          <Button title="Registrarse" color="#3897f0" />
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
    paddingVertical: 40,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    fontFamily: "Pacifico",
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    height: 50,
    borderRadius: 30,
  },
  image: {
    width: 150, // Ancho de la imagen
    height: 150, // Alto de la imagen
    marginBottom: 50, // Espacio entre la imagen y el título
  },
});


