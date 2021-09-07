import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    storeData(todos);
  }, [todos]);

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcon]}
            onPress={() => todoComplete(todo?.id)}>
            <Icon name="done" color="white" size={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionIcon, {backgroundColor: 'red'}]}
          onPress={() => todoDelete(todo?.id)}>
          <Icon name="delete" color="white" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  const storeData = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonValue);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      jsonValue != null ? setTodos(JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Enter task name');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const todoComplete = todoId => {
    const newTodos = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newTodos);
  };

  const todoDelete = todoId => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  };

  const deleteAll = () => {
    if (Object.keys(todos).length !== 0) {
      Alert.alert('Confirm', 'Are you sure you want to delete all todos?', [
        {
          text: 'Yes',
          onPress: () => setTodos([]),
        },
        {text: 'No'},
      ]);
    } else {
      Alert.alert('List is already empty!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Todo App</Text>
        <Icon name="delete" size={25} color="red" onPress={deleteAll}></Icon>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.input}>
          <TextInput
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
            value={textInput}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <Icon name="add-circle" size={55} color="blue"></Icon>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    elevation: 5,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  listItem: {
    padding: 20,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default App;
