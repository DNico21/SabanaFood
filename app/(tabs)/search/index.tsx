import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig'; // Importa tu configuración de Firebase

export default function Search() {
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [users, setUsers] = useState<any[]>([]); // Lista de usuarios
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Usuarios filtrados

  // Obtener los usuarios de Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'Users'));
      const usersList = querySnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
      setFilteredUsers(usersList); // Inicialmente muestra todos los usuarios
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        `${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Si no hay término de búsqueda, mostrar todos
    }
  }, [searchTerm, users]);



  // Renderizar cada usuario en la lista
  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userItem}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require('@/assets/images/adaptive-icon.png')
        }
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.firstname} {item.lastname}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Buscar"
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm} // Actualiza el término de búsqueda
        />
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={filteredUsers} // Lista filtrada según la búsqueda
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderUserItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'flex-start', // Alinea los elementos al inicio
    padding: 10, // Espaciado alrededor del contenedor
  },
  inputContainer: {
    width: '100%', // Ocupa todo el ancho del contenedor
    marginVertical: 10, // Espaciado entre el borde y el TextInput
  },
  input: {
    padding: 10,
    paddingHorizontal: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
