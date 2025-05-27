import React, { useState } from 'react';
import {StyleSheet,Text,View,Image,FlatList,TouchableOpacity,Alert,TextInput,Button,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const Livros = [
  {
    id: 1,
    nome: 'Como se fôssemos vilões',
    autor: 'Rio M. L',
    sinopse:
      'Oliver Marks acabou de cumprir uma pena de dez anos na prisão por um assassinato que pode ou não ter cometido...',
    imagem: require('./assets/como_se.jpg'),
  },
  {
    id: 2,
    nome: 'Vilão',
    autor: 'V. E. Schwab',
    sinopse:
      'Victor e Eli, dois jovens brilhantes, se conheceram na Universidade de Merit e logo se deram bem...',
    imagem: require('./assets/vilao.jpg'),
  },
  {
    id: 3,
    nome: 'Aniquilação',
    autor: 'Jeff VanderMeer',
    sinopse:
      'A Área X está isolada do restante do mundo há décadas, e a natureza tomou para si os últimos vestígios...',
    imagem: require('./assets/aniquilacao.jpg'),
  },
];

function criaItem({ item, expandedId, setExpandedId }) {
  const isExpanded = expandedId === item.id;

  const toggleExpand = () => {
    setExpandedId(isExpanded ? null : item.id);
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={toggleExpand}>
      <Image source={item.imagem} style={styles.capa} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        {isExpanded && (
          <View>
            <Text style={styles.autor}>Autor: {item.autor}</Text>
            <Text style={styles.sinopse}>{item.sinopse}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function Home({ navigation }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={Livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => criaItem({ item, expandedId, setExpandedId })}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={() => (
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Button title="Fazer Review" onPress={() => navigation.navigate('Review')} />
          </View>
        )}
      />
    </View>
  );
}

function Review() {
  const [nomeLivro, setNomeLivro] = useState('');
  const [nota, setNota] = useState('');
  const [review, setReview] = useState('');

  const enviarReview = () => {
    Alert.alert('Review salva');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escolha o livro:</Text>
      <FlatList
        data={Livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.input,
              { backgroundColor: item.nome === nomeLivro ? '#a0c4ff' : 'white' },
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

      <Button title="Enviar" onPress={enviarReview} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Review" component={Review} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#d8e4ed',
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
  },
  autor: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  sinopse: {
    marginTop: 5,
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
});
