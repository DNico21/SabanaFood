// message.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { useRouter } from "expo-router";

export default function Messages() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const usersList = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (user: any) => {
    router.push({
      pathname: "/(tabs)/home/detail/[id]", 
      params: { id: user.id, userName: `${user.firstname} ${user.lastname}` },
    });
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar usuario"
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => openChat(item)}>
            <Image
              source={
                item.profileImage
                  ? { uri: item.profileImage }
                  : require("@/assets/images/adaptive-icon.png")
              }
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.firstname} {item.lastname}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
