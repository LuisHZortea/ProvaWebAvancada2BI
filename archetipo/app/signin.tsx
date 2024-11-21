import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoUVV from '../assets/images/uvv.png';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SignIn() {
  // Estados para armazenar o email, senha e o foco nos campos de entrada
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  // Variável para habilitar o botão de login apenas quando email e senha estiverem preenchidos
  const isLoginEnabled = email !== '' && senha !== '';

  // Função para enviar os dados de login para a API
  async function submit() {
    // Verifica se o formulário foi preenchido corretamente
    if (!isLoginEnabled) {
      alert("Não deixe usuário ou senha em branco");
      return;
    }

    // Exibe no console os dados de email e senha
    console.log("Email :" + email);
    console.log("Senha :" + senha);

    // Faz a requisição de login para o servidor
    const response = await fetch("http://localhost:3000/auth/signin", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: senha,
        email: email
      })
    });

    // Obtém o resultado da resposta
    const result = await response.json();
    console.log(result);

    // Verifica se o status da resposta é diferente de 200 (erro de autenticação)
    if (result.status !== 200) {
      alert("Erro ao realizar a autenticação");
    } else {
      // Caso a autenticação seja bem-sucedida, armazena o token e dados do usuário
      if (Platform.OS === 'web') {
        sessionStorage.setItem("token_autenticacao", result.token);
        sessionStorage.setItem("user", JSON.stringify(result.user));
      } else {
        SecureStore.setItem("token_autenticacao", result.token); // Armazena o token de autenticação
        SecureStore.setItem("user", JSON.stringify(result.user)); // Armazena os dados do usuário
      }
      
      // Navega para a página principal após login bem-sucedido
      router.push("/(tabs)");
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
        <IconButton onClick={() => router.push("/")} style={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <View style={styles.logoContainer}>
          <Image source={LogoUVV} style={styles.logo} />
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
        <Text style={[styles.placeholder, isSenhaFocused || senha ? styles.focusedPlaceholder : null]}>
          Senha
        </Text>
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
        onPress={() => { submit() }}
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
    backgroundColor: '#1DA1F2',
  },
  loginButtonText: {
    color: '#AAA',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
  loginButtonTextEnabled: {
    color: '#FFF', 
  },
});