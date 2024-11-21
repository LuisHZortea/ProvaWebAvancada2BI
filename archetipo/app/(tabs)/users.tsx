import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import LogoUVV from '../../assets/images/9.png';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  try {
    let token;
    if (Platform.OS === 'web') {
      token = sessionStorage.getItem("token_autenticacao");
    } else {
      token = await SecureStore.getItemAsync("token_autenticacao");
    }

    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": token ?? "",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os usuários");
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return [];
  }
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  const handleUserPress = (userId: number) => {
    // Você pode redirecionar para uma página de detalhes do usuário, se necessário
    router.push(`/users/${userId}`);
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item.id)}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={LogoUVV} style={styles.logo} />
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
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
  userContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#ddd',
    fontSize: 14,
  },
});
