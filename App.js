import React, { useState } from 'react';
import {StyleSheet,Text,View,Image,FlatList,TouchableOpacity,Alert,TextInput,Button} from 'react-native';
import * as Speech from 'expo-speech';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapView, { Marker } from 'react-native-maps';

const Drawer = createDrawerNavigator();

export default function App() {
  const [livros, setLivros] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  function LivrosLidos() {
    const renderItem = ({ item }) => {
          const falar = () => {
            const texto = `Nome do livro é ${item.nome}. e autor é ${item.autor}`;
            Speech.speak(texto, {language: 'pt-BR',});
          };
      const isExpanded = expandedId === item.id;

      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          {item.imagem && <Image source={{ uri: item.imagem }} style={styles.capa} />}
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.nome}>{item.nome}</Text>
            {isExpanded && (
              <Text style={styles.autor}>Autor: {item.autor}</Text>
            )}
          </View>
           <Button title="Ouvir" onPress={falar} />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={livros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function AdicionarLivro() {
    const [nome, setNome] = useState('');
    const [autor, setAutor] = useState('');
    const [imagem, setImagem] = useState('');

    const adicionar = () => {
      const novoLivro = {
        id: Date.now(),
        nome,
        autor,
        imagem,
      };
      setLivros((prev) => [...prev, novoLivro]);
      setNome('');
      setAutor('');
      setImagem('');
    };
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Nome do livro"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Autor"
          style={styles.input}
          value={autor}
          onChangeText={setAutor}
        />
        <TouchableOpacity style={styles.butao} onPress={adicionar}>
          <Text style={styles.textoBotao}>Adicionar Livro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Review() {
    const [nomeLivro, setNomeLivro] = useState('');
    const [nota, setNota] = useState('');
    const [review, setReview] = useState('');

    const enviarReview = () => {
      const novaReview = {
        id: Date.now(),
        nomeLivro,
        nota,
        review,
      };
      setReviews((prev) => [...prev, novaReview]);
      setNota('');
      setReview('');
      setNomeLivro('');
      Alert.alert('Review salva!');
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Escolha o livro:</Text>
        <FlatList
          data={livros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.input,
                { backgroundColor: item.nome === nomeLivro ? '#d8e4ed' : '#4b2e14' },
              ]}
              onPress={() => setNomeLivro(item.nome)}
            >
              <Text>{item.nome}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 150, marginBottom: 15 }}
        />

        <Text style={styles.label}>Livro selecionado:</Text>
        <Text style={{ marginBottom: 15 }}>{nomeLivro || 'Nenhum livro selecionado'}</Text>
        <Text style={styles.label}>Nota:</Text>
        <TextInput
          style={styles.input}
          value={nota}
          onChangeText={setNota}
          placeholder="Digite uma nota"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Review:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={review}
          onChangeText={setReview}
          placeholder="Escreva seu review"
        />

        <TouchableOpacity style={styles.butao} onPress={enviarReview}>
          <Text style={styles.textoBotao}>Enviar Review</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function SuasReviews() {
    return (
      <View style={styles.container}>
        {reviews.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma review cadastrada.</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>{item.nomeLivro}</Text>
                <Text>Nota: {item.nota}</Text>
                <Text style={{ marginTop: 4 }}>{item.review}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  function Bibliotecas() {
    const bibliotecas = [
      {
        nome: 'Biblioteca Central URCAMP',
        latitude: -31.329547,
        longitude: -54.067946,
      },
      {
        nome: 'Biblioteca Pública Dr. Otávio Santos',
        latitude: -31.329674,
        longitude: -54.106329,
      },
      {
        nome: 'Biblioteca do IFSul Campus Bagé',
        latitude: -31.341201,
        longitude: -54.089481,
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.tituloMapa}>Bibliotecas</Text>
        <MapView
          style={styles.mapa}
          initialRegion={{
            latitude: -31.33,
            longitude: -54.08,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {bibliotecas.map((b, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: b.latitude, longitude: b.longitude }}
              title={b.nome}
            />
          ))}
        </MapView>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Adicionar Livro" screenOptions={{
        drawerStyle: {
          backgroundColor: '#f5f5dc',
        },
        headerStyle: {
        backgroundColor: '#f5f5dc',
         },
        }}>
        <Drawer.Screen name="Adicionar Livro" component={AdicionarLivro} />
        <Drawer.Screen name="Livros Lidos">{() => <LivrosLidos />}</Drawer.Screen>
        <Drawer.Screen name="Review">{() => <Review />}</Drawer.Screen>     
        <Drawer.Screen name="Suas Reviews">{() => <SuasReviews />}</Drawer.Screen>
        <Drawer.Screen name="Bibliotecas" component={Bibliotecas} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5dc',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#d8e4ed',
    backgroundColor: '#d2b48c',
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
  },
  capa: {
    width: 60,
    height: 90,
    borderRadius: 5,
    resizeMode: 'cover',
    
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4b2e14',   
  },
  autor: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  tituloMapa: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
    paddingBottom: 10,
  },
  mapa: {
    flex: 1,
  },
  butao: {
  backgroundColor: '#8b4513',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
},
textoBotao: {
  color: '#f5f5dc',
  fontWeight: 'bold',
  fontSize: 16,
}
});
      