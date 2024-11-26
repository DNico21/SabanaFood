import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { DataContext } from '@/context/dataContext/DataContext';
import { PostProps } from '@/interfaces/postInterface';

export default function HomePage() {
  const { getPosts } = useContext(DataContext);
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: PostProps }) => (
    <View style={styles.postContainer}>    
      <Text style={styles.postUsername}>Publicado por: {item.username}</Text>
      <Text style={styles.postAddress}>Ubicación: {item.address}</Text>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noPostsText}>No hay publicaciones aún</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postDescription: {
    marginTop: 10,
    fontSize: 16,
  },
  postUsername: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
  postAddress: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  noPostsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
