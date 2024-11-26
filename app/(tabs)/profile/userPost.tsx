import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, StyleSheet } from "react-native";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext/AuthContext";

export default function UserPost() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const [posts, setPosts] = useState<any[]>([]);

  // Función para cargar los posts del usuario
  const fetchUserPosts = async () => {
    if (user) {
      const q = query(
        collection(db, "posts"),
        where("postedBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userPosts = querySnapshot.docs.map((doc) => doc.data());
      setPosts(userPosts);
    }
  };

  useEffect(() => {
    fetchUserPosts(); // Cargar posts del usuario
  }, []);

  const renderPost = ({ item }: { item: any }) => {
    // Convertir el campo de fecha de Firestore a un objeto de JavaScript Date
    const postDate = item.date?.seconds
      ? new Date(item.date.seconds * 1000).toLocaleDateString() // Convertir a una fecha legible
      : "Fecha no disponible"; // En caso de que no haya fecha, manejarlo de forma segura

    return (
      <View style={styles.postContainer}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
        <Text style={styles.postDescription}>{item.description}</Text>
        <Text style={styles.postDate}>Publicado el {postDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  postDescription: {
    marginTop: 10,
    fontSize: 16,
  },
  postDate: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
});
