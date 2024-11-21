import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { router, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface Comment {
  id: number,
  title: string,
  content: string,
  published: boolean,
  postId: number, 
  authorId: number,
}

interface Post {
  id: number; 
  authorId: number;
  title: string;
  content: string;
}

const getPost = async (postId: string): Promise<number> => {
  try {
    let token;
    if (Platform.OS === 'web') {
    token = sessionStorage.getItem("token_autenticacao")
    } else {
    token = SecureStore.getItem("token_autenticacao");
    }
    const response = await fetch(`http://localhost:3000/post/${postId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "authorization": token??""
    },
    });

    if (!response.ok) {
    throw new Error("Erro ao buscar o post");
    }

    // Converte a resposta para JSON
    const post: Post = (await response.json()).post;

    // Retorna o nome do autor
    return post.authorId;
  } catch (error) {
      console.error("Erro ao obter o post:", error);
      return 1;
  }
}

interface Author {
  id: number;
  name: string;
  email: string;
  password: string;
}

const getAuthor = async (authorId: number): Promise<string> => {
  try {
      let token;
      if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao")
      } else {
      token = SecureStore.getItem("token_autenticacao");
      }
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

const CommentScreen = () => { 
  const inputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const { id } = useLocalSearchParams();

  const isPostEnabled = title !== '' && content !== '';

  async function submit() {
    let token;
    let user;

    if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao");
      user = JSON.parse(sessionStorage.getItem("user") ?? "");
    } else {
      token = await SecureStore.getItem("token_autenticacao");
      user = JSON.parse(await SecureStore.getItem("user") ?? "");
    }

    console.log("Título: " + title);
    console.log("Conteúdo: " + content);
    console.log("Id do Autor: " + user.id);
    console.log("Token: " + token);
    console.log("Post ID: " + id);

    const response = await fetch("http://localhost:3000/comment", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "authorization": token ?? ""
      },
      body: JSON.stringify({
        title: title,
        content: content,
        published: true,
        postId: parseInt(id as string), 
        authorId: user.id,
      })
    });

    const result = await response.json();
    console.log(result);
    if (result.status !== 200) {
      alert("Erro ao realizar a autenticação");
    } else {
      router.push("/(tabs)");
    }
  }

  useEffect(() => {
    // Foca automaticamente no campo de texto ao carregar a tela
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getPostAuthor = async ()=> setAuthor(await getAuthor(await getPost(id.toString())));
  getPostAuthor();
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <IconButton onClick={() => router.push("../../(tabs)")} style={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <TouchableOpacity
          style={[styles.publishButton, isPostEnabled && styles.publishButtonEnabled]}
          onPress={() => { submit() }}
          disabled={!isPostEnabled}>
          <Text style={styles.publishText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postIdText}>
        Em resposta a <Text style={styles.postId}>{author}</Text>
      </Text>

      <TextInput
        ref={inputRef}
        style={styles.inputTitle}
        placeholder="Qual o título do seu comentário?"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Publicar sua resposta"
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    justifyContent: 'space-between',
  },
  topContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    left: 0,
    color: '#FFF',
    padding: 0,
    zIndex: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
    borderWidth: 0,
    borderColor: "transparent",
    outlineStyle: "none",
  },
  inputTitle: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
    borderWidth: 0,
    borderColor: "transparent",
    outlineStyle: "none",
    fontWeight: 'bold',
  },
  publishButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#444',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  publishButtonEnabled: {
    backgroundColor: '#1d9bf0',
  },
  publishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postIdText: {
    color: '#888',
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'regular',
  },
  postId: {
    color: '#1d9bf0',
  },
});

export default CommentScreen;
