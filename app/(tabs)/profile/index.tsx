import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext/AuthContext";
import { useRouter } from "expo-router"; // Importar el hook useRouter
import { LinearGradient } from "expo-linear-gradient"; // Importar LinearGradient

export default function Profile() {
  const [posts, setPosts] = useState<string[]>([]);
  const { state } = useContext(AuthContext);
  const { firstname, lastname, profileImage } = state.user || {
    firstname: "",
    lastname: "",
    profileImage: "",
  };

  const router = useRouter(); // Hook para la navegación

  // Estado para controlar la visibilidad del modal
  const [isModalVisible, setModalVisible] = useState(false);

  // Función para cargar los posts del usuario
  const fetchUserPosts = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(db, "posts"),
        where("postedBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userPosts = querySnapshot.docs.map((doc) => doc.data().image);
      setPosts(userPosts);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts(); // Cargar posts del usuario
    }, [])
  );

  // Función para abrir el modal al hacer clic en la imagen de perfil
  const handleProfileImagePress = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Función para manejar clic en una publicación y redirigir a userPost
  const handlePostImagePress = () => {
    router.push("/(tabs)/profile/userPost");
  };

  const renderPostImage = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={handlePostImagePress}>
      <Image source={{ uri: item }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Contenedor LinearGradient para la imagen de perfil */}
        <TouchableOpacity onPress={handleProfileImagePress}>
          <LinearGradient
            colors={["#E012D0", "#E0D128"]} // Gradiente de colores (puedes personalizarlos)
            style={styles.gradientContainer}
          >
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/images/adaptive-icon.png")
              } // Mostrar imagen de perfil del usuario
              style={styles.profileImage}
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.username}>{posts.length}</Text>
          <Text style={styles.username}>Publicaciones</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.username}>##</Text>
          <Text style={styles.username}>Seguidores</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.username}>##</Text>
          <Text style={styles.username}>Seguidos</Text>
        </View>
      </View>

      {/* Mostrar el nombre del usuario */}
      <View style={styles.descrContainer}>
        <Text>
          {firstname} {lastname}
        </Text>
        <Text>Descripción</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/(tabs)/profile/editprofile" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/profile/configuration" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ajustes</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.publicacionesContainer}>
        <FlatList
          data={posts}
          renderItem={renderPostImage}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3} // Muestra 3 columnas
        />
      </View>

      {/* Modal para mostrar la imagen de perfil en grande */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleCloseModal}>
            <Image
              source={profileImage ? { uri: profileImage } : require("@/assets/images/adaptive-icon.png")}
              style={styles.modalProfileImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "space-between",
  },

  profileContainer: {
    flexDirection: "row", // Pone los elementos en fila
    alignItems: "center",
    margin: 15, // Alinea verticalmente en el centro
  },

  descrContainer: {
    margin: 10,
  },

  profileImage: {
    width: 80, // Ancho de la imagen
    height: 80, // Alto de la imagen
    borderRadius: 40, // Hace que la imagen sea circular
    marginLeft: 5, // Espacio entre la imagen y el texto
    borderColor: "#60FA1B",
  },

  gradientContainer: {
    width: 90, // Tamaño del contenedor para que rodee la imagen de perfil
    height: 90,
    borderRadius: 45, // Hace que el contenedor también sea circular
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginRight: 20,
  },

  modalProfileImage: {
    width: 300, // Tamaño de la imagen en el modal
    height: 300,
    borderRadius: 150, // Hace que la imagen sea circular en el modal
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "center", // Centra el texto y el número horizontalmente
  },

  username: {
    alignContent: "center",
    fontSize: 13,
    fontWeight: "bold",
    margin: 4,
  },

  publicacionesContainer: {
    alignContent: "space-between",
    alignItems: "flex-start",
  },

  buttonContainer: {
    flexDirection: "row", // Pone los botones en fila
    justifyContent: "space-around", // Espacio alrededor de los botones
    marginVertical: 20,
  },

  button: {
    backgroundColor: "#2196F3", // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Esquinas redondeadas
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  postImage: {
    width: 131,
    height: 131, // Ajusta según tus necesidades
    margin: 0,
    aspectRatio: 1 / 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo semitransparente para el modal
  },
});
