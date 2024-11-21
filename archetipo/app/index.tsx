import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import LogoUVV from '../assets/images/9.png';
import { router } from 'expo-router';

export default function Index() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Roboto_400Regular,
        Roboto_500Medium,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Image source={LogoUVV} style={styles.logo} />
      <Text style={styles.title}>Veja o que está acontecendo no mundo neste momento.</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push("/signin")} >
          <Text style={styles.buttonTextPrimary}>Entrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/signup")}>
          <Text style={styles.buttonTextSecondary}>Criar conta</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Ao se inscrever, você concorda com nossos <Text style={styles.link}>Termos</Text>, a <Text style={styles.link}>Política de Privacidade</Text> e o <Text style={styles.link}>Uso de Cookies</Text>.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  logo: {
    width: 48,
    height: 48,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'left',
    fontFamily: 'Roboto_500Medium',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    height: '35%',
  },
  buttonPrimary: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 30,
    width: '100%',
  },
  buttonTextSecondary: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    textAlign: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 10,
  },
  link: {
    color: '#1DA1F2',
  },
});
