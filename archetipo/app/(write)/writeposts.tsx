import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const PostScreen = () => { 
  const inputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isPostEnabled = title !== '' && content !== '';

  async function submit(){

    let token;
    let user;

    if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao")
      user = JSON.parse(sessionStorage.getItem("user")??"") 
    } else {
      token = SecureStore.getItem("token_autenticacao");
      user = JSON.parse(SecureStore.getItem("user")??"") 
    }

    console.log("Título: "+ title);
    console.log("Conteúdo: "+ content);
    console.log("Id do Autor: "+ user.id);
    console.log("Token: "+ token);

    const response = await fetch("http://localhost:3000/post", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "authorization": token??""
      },
      body: JSON.stringify({
        title: title,
        content: content,
        published: true,
        authorId: user.id,
      })
    })

    const result = await response.json();
    console.log(result);
    if(result.status !== 200){
      alert("Erro ao realizar a autenticação");
    } else {
      router.push("/(tabs)")
    }
  }

  useEffect(() => {
    // Foca automaticamente no campo de texto ao carregar a tela
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])

  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <IconButton  onClick={() => router.push("../(tabs)")} style={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <TouchableOpacity 
          style={[styles.publishButton, isPostEnabled && styles.publishButtonEnabled]}
          onPress={() => {submit()}}
          disabled={!isPostEnabled}>
          <Text style={styles.publishText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        ref={inputRef}
        style={styles.inputTitle}
        placeholder="Qual o título da sua postagem?"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="O que está acontecendo?"
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
});

export default PostScreen;
