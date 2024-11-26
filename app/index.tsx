//index.tsx
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a SabanaFood</Text>

      <Image
        source={require("../assets/images/Unisabana.png")} // Usar require para imágenes locales
        style={styles.image}
      />

      {/* Contenedor para el botón de Iniciar Sesión */}
      <View style={styles.buttonContainer}>
        <Link href={"/singin"} asChild>
          <Button title="Iniciar Sesión" color="#042464" />
        </Link>
      </View>

      {/* Contenedor para el botón de Registrarse */}
      <View style={styles.buttonContainer}>
        <Link href={"/singup"} asChild>
          <Button title="Registrarse" color="#042464" />
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
    fontSize: 40,
    fontWeight: "bold",
    color: "#0",
    marginBottom: 40,
    fontFamily: "Pacifico",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    height: 50,
    borderRadius: 100,
  },
  image: {
    width: 400, // Ancho de la imagen
    height: 400, // Alto de la imagen
    marginBottom: 50, // Espacio entre la imagen y el título
  },
});