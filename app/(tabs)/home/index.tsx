import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function HomePage() {
  const router = useRouter();

  const handlePress = (id: string) => {
    router.push(`/home/detail/${id}`); // Navega a la página de la imagen con el ID
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Botón con Imagen 1 */}
        <TouchableOpacity onPress={() => handlePress("1")}>
          <Image
            source={require("@/assets/images/MenuArcos.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Botón con Imagen 2 */}
        <TouchableOpacity onPress={() => handlePress("2")}>
          <Image
            source={require("@/assets/images/MenuEmbarca.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Botón con Imagen 3 */}
        <TouchableOpacity onPress={() => handlePress("3")}>
          <Image
            source={require("@/assets/images/MenuCipreses.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Botón con Imagen 4 */}
        <TouchableOpacity onPress={() => handlePress("4")}>
          <Image
            source={require("@/assets/images/MenuEscuela.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Botón con Imagen 5 */}
        <TouchableOpacity onPress={() => handlePress("5")}>
          <Image
            source={require("@/assets/images/MenuKioskos.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Botón con Imagen 6 */}
        <TouchableOpacity onPress={() => handlePress("6")}>
          <Image
            source={require("@/assets/images/MenuSanduche.jpg")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10, // Espaciado vertical entre los elementos y los bordes del contenedor
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },

  image: {
    width: 360,
    height: 110,
    margin: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
});