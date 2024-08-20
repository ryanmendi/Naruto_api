import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TextInput, ImageBackground } from 'react-native';

// Função para fazer a requisição da API
const request = async (callback) => {
  try {
    const response = await fetch('https://narutodb.xyz/api/character?limit=50'); // Limite reduzido para testes
    const parsed = await response.json();
    if (parsed.characters) {
      callback(parsed.characters);
    } else {
      console.error('Dados não encontrados na resposta da API:', parsed);
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
};

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredRegistros, setFilteredRegistros] = useState([]);

  // Fetch data from API and set the registros state
  useEffect(() => {
    request(setRegistros);
  }, []);

  // Update filteredRegistros based on search input
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredRegistros(registros);
    } else {
      setFilteredRegistros(
        registros.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, registros]);

  // RenderItem function with conditional rendering
  const renderItem = ({ item }) => {
    // Substitua `item.images` por uma URL de imagem válida se disponível
    const imageUrl = item.images && typeof item.images === 'string' ? item.images : null;

    return (
      <View style={styles.itemContainer}>
        {/* Imagem opcional */}
        {/* {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text>Imagem não disponível</Text>
        )} */}
        
        <Text style={styles.item}>Nome: {item.name}{'\n'}</Text>
        <Text style={styles.item}>Id: {item.id}{'\n'}</Text>
        <Text style={styles.item}>Jutsu: {item.jutsu}{'\n'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Personagens de Naruto</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar personagem..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredRegistros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum personagem encontrado</Text>}
      />
      <StatusBar style="auto" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fundo claro para se assemelhar ao estilo do anime
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  searchInput: {
    height: 40,
    width: '90%',
    borderColor: '#ff6600', // Cor laranja Naruto
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#ff6600', // Cor laranja Naruto
    borderRadius: 10,
    margin: 8,
    padding: 10,
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    color: '#fff', // Texto branco para contraste
  },
  titulo: {
    fontSize: 30,
    marginVertical: 20,
    color: '#fff', // Texto escuro para o título
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});
