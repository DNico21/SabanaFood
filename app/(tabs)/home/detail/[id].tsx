import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataContext } from "@/context/dataContext/DataContext";
import { PostProps } from "@/interfaces/postInterface";
import { FontAwesome5 } from "@expo/vector-icons";
import ModalCamera from "@/components/ModalCamera";
import { Image } from "expo-image";

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams(); // Obtener el ID del restaurante desde la URL
  const { getPosts, newPost, state } = useContext(DataContext); // Acceso al DataContext
  const [restaurantPosts, setRestaurantPosts] = useState<PostProps[]>([]); // Publicaciones del restaurante
  const [newReview, setNewReview] = useState<string>(""); // Nueva reseña
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [currentPhoto, setCurrentPhoto] = useState<any>(undefined); // Foto actual
  const [isVisible, setIsVisible] = useState<boolean>(false); // Estado de visibilidad del modal de la cámara

  const restaurantName = (() => {
    switch (id) {
      case "1":
        return "Arcos Restaurante";
      case "2":
        return "Embarca Restaurante";
      case "3":
        return "Cipreses Restaurante";
      case "4":
        return "Escuela Restaurante";
      case "5":
        return "Kioskos Restaurante";
      case "6":
        return "Sanduche Restaurante";
      default:
        return "Restaurante desconocido";
    }
  })();

  // Definimos la función fetchPosts fuera del useEffect para poder utilizarla en cualquier parte
  const fetchPosts = async () => {
    setLoading(true); // Iniciar la carga
    try {
      const posts = await getPosts(id as string); // Asegúrate de que getPosts esté obteniendo publicaciones del restaurante con el ID
      setRestaurantPosts(posts); // Actualiza el estado con las publicaciones
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  // Ejecutamos fetchPosts cuando el ID cambie
  useEffect(() => {
    fetchPosts();
  }, [id]); // Solo ejecuta este efecto cuando el ID cambie

  const handleAddReview = async () => {
    if (!newReview.trim() && !currentPhoto?.uri) return; // Valida que haya texto o foto

    try {
      setLoading(true);
      await newPost({
        address: "Dirección no especificada",
        description: newReview,
        image: currentPhoto?.uri || "", // Si no hay foto, envía una cadena vacía
        date: new Date(),
        restaurantId: id as string, // Vincula la reseña al restaurante
        likes: 0,
        username: "Usuario Anónimo",
      });

      setNewReview(""); // Limpia el campo de texto
      setCurrentPhoto(undefined); // Limpia la foto seleccionada
      // Puedes recargar las publicaciones después de agregar la reseña si lo deseas
      fetchPosts(); // Vuelve a cargar las publicaciones después de agregar la reseña
    } catch (error) {
      console.error("Error agregando reseña:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reseñas de {restaurantName}</Text>

      {/* Lista de publicaciones */}
      <FlatList
        data={restaurantPosts}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.username}>{item.username || "Anónimo"}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {item.image ? (
              <Image
                style={styles.postImage}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={1000}
              />
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noReviews}>No hay reseñas aún.</Text>}
      />

      {/* Entrada de nueva reseña con botones */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu reseña aquí..."
          value={newReview}
          onChangeText={setNewReview}
          multiline
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleAddReview}>
          <FontAwesome5 name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsVisible(true)}
        >
          <FontAwesome5 name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal para tomar o seleccionar una foto */}
      <ModalCamera
        isVisible={isVisible}
        onSave={(photo) => {
          setCurrentPhoto(photo); // Guarda la foto seleccionada
          setIsVisible(false);
        }}
        onClose={() => setIsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  post: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  username: {
    fontWeight: "bold",
  },
  description: {
    marginTop: 5,
  },
  postImage: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    textAlignVertical: "top",
  },
  iconButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
  },
  noReviews: {
    fontSize: 16,
    color: "gray",
    marginVertical: 20,
  },
});