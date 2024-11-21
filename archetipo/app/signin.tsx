import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoUVV from '../assets/images/9.png';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  const isLoginEnabled = email !== '' && senha !== '';

  async function submit(){
    if(!isLoginEnabled){
      alert("Não deixe usuário ou senha em branco");
    }

    console.log("Email :"+ email);
    console.log("Senha :"+ senha);

    const response = await fetch("http://localhost:3000/auth/signin", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: senha,
        email: email
      })
    })

    const result = await response.json();
    console.log(result);
    
    
    
    if(result.status !== 200){
      alert("Erro ao realizar a autenticação");
    } else {
      if (Platform.OS === 'web') {
        sessionStorage.setItem("token_autenticacao",result.token);
        sessionStorage.setItem("user",JSON.stringify(result.user));
      } else {
        SecureStore.setItem("token_autenticacao",result.token);
        SecureStore.setItem("user",JSON.stringify(result.user));
      }
      router.push("/(tabs)")
    }
  }

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <IconButton  onClick={() => router.push("/")} style={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <View style={styles.logoContainer}>
          <Image source={LogoUVV} style={styles.logo}/>
        </View>
      </View>

      <Text style={styles.title}>Digite seus dados de usuário</Text>

      <View style={[styles.inputContainer]}>
        <Text style={[styles.placeholder, isEmailFocused || email ? styles.focusedPlaceholder : null]}>
          E-mail
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.placeholder, isSenhaFocused || senha ? styles.focusedPlaceholder : null]}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          onFocus={() => setIsSenhaFocused(true)}
          onBlur={() => setIsSenhaFocused(false)}
        />
      </View>

      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, isLoginEnabled && styles.loginButtonEnabled]}
        disabled={!isLoginEnabled}
        onPress={() => {submit()}}
      >
        <Text style={[styles.loginButtonText, isLoginEnabled && styles.loginButtonTextEnabled]}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    width: '100%',
  },
  topContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    color: '#FFF',
    padding: 0,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Roboto_500Medium',
    marginTop: 32,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    position: 'relative',
  },
  placeholder: {
    color: '#777',
    position: 'absolute',
    left: 0,
    top: 10,
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
  focusedPlaceholder: {
    top: -10,
    fontSize: 12,
    color: '#FFF',
    backgroundColor: '#000',
    paddingHorizontal: 2,
    marginLeft: 4,
  },
  input: {
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontFamily: 'Roboto_400Regular',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#1DA1F2',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  loginButton: {
    backgroundColor: '#444',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonEnabled: {
    backgroundColor: '#1DA1F2', // Muda a cor para azul quando habilitado
  },
  loginButtonText: {
    color: '#AAA',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
  loginButtonTextEnabled: {
    color: '#FFF', // Muda a cor do texto para branco quando habilitado
  },
});
