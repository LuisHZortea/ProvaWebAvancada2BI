import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import LogoUVV from '../../assets/images/9.png';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';


interface Post {
  id: number; 
  authorId: number;
  title: string;
  content: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
  password: string;
}

const getAuthor = async (authorId: string): Promise<string> => {
  try {
    let token;
    if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao")
    } else {
      token = SecureStore.getItem("token_autenticacao");
    }
    // Faz a requisição para a API que contém os autores
    const response = await fetch(`http://localhost:3000/author/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": token??""
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar o autor");
    }

    // Converte a resposta para JSON
    const author: Author = (await response.json()).author;

    // Retorna o nome do autor
    return author.name;
  } catch (error) {
    console.error("Erro ao obter o nome do autor:", error);
    return "Autor desconhecido";
  }
};

const listPosts = async (): Promise<Post[]> => {
  try {
    let token;
    if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao")
    } else {
      token = SecureStore.getItem("token_autenticacao");
    }
    // Faz a requisição para a rota da API
    const response = await fetch("http://localhost:3000/posts", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": token??""
      }),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao buscar os posts");
    }

    // Converte a resposta para JSON
    const posts = await response.json();
    return posts; // Garante o retorno dos posts em caso de sucesso
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState<{ [key: string]: string }>({});

  // Carrega os posts ao montar o componente
  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await listPosts();
      setPosts(fetchedPosts);
    };

    console.log(posts)

    loadPosts();
  }, []);

  useEffect(() => {
    const loadAuthors = async () => {
      const authorNameMap: { [key: string]: string } = {};

      for (const post of posts) {
        if (!authorNameMap[post.authorId.toString()]) {
          const authorName = await getAuthor(post.authorId.toString());
          authorNameMap[post.authorId.toString()] = authorName;
        }
      }

      setAuthorName(authorNameMap);
      
    };

    if (posts.length > 0) {
      loadAuthors();
    }
  }, [posts]);

  // Função para renderizar um único post
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{authorName[item.authorId.toString()] || "Carregando..."}</Text>
        <TouchableOpacity
          style={styles.deleteCommentButton}
          onPress={() => handleDeleteButtonPress(item.id.toString())}
          >
          <FontAwesome name="trash" size={16} color="#a9a9a9" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <TouchableOpacity style={styles.addCommentButton} onPress={() => handleCommentButtonPress(item.id.toString())}>
        <FontAwesome name="comment" size={16} color="#a9a9a9" />
      </TouchableOpacity>
    </View>
  );

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleButtonPress = () => {
    console.log('Novo post');
    router.push("../(write)/writeposts");
  };

  const handleCommentButtonPress = async (id: string): Promise<void> => {
    console.log('Novo comentário');
    router.push(`../(write)/writecomments/${id}`);
  };

  const handleDeleteButtonPress = async (id: string): Promise<void> => {
    console.log(`Deletando post com id: ${id}`);
    try {
      let token;
      if (Platform.OS === 'web') {
        token = sessionStorage.getItem("token_autenticacao");
      } else {
        token = await SecureStore.getItemAsync("token_autenticacao");
      }
  
      const response = await fetch(`http://localhost:3000/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": token ?? "",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar o post");
      }
  
      console.log("Post deletado com sucesso.");
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== parseInt(id)));
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          <Image source={LogoUVV} style={styles.logo}/>
        </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.postButton} onPress={handleButtonPress}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 50,
    height: 50,
  },
  list: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#111',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  username: {
    color: '#1DA1F2',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  content: {
    color: '#ddd',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  addCommentButton: {
    justifyContent: 'flex-end',
    height: 24,
  },
  deleteCommentButton: {
    justifyContent: 'center',
    height: 24,
  },
  postButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1DA1F2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
