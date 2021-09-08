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
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'react-moment';
import 'moment-timezone';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([]);

  let moment = require('moment-timezone');

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    storeData(todos);
  }, [todos]);

  const ListItem = ({todo}) => {
    return (
      //<View style={[styles.listItem, {backgroundColor: randomRGB()}]}>
      // <View style={styles.listItem}>
      //   <View style={{flex: 1}}>
      //     <Text
      //       style={{
      //         fontWeight: 'bold',
      //         fontSize: 15,
      //         textDecorationLine: todo?.completed ? 'line-through' : 'none',
      //       }}>
      //       {todo?.task}
      //     </Text>
      //   </View>
      //   {!todo?.completed && (
      //     <TouchableOpacity
      //       style={[styles.actionIcon]}
      //       onPress={() => todoComplete(todo?.id)}>
      //       <Icon name="done" color="white" size={20} />
      //     </TouchableOpacity>
      //   )}
      //   <TouchableOpacity
      //     style={[styles.actionIcon, {backgroundColor: 'red'}]}
      //     onPress={() => todoDelete(todo?.id)}>
      //     <Icon name="delete" color="white" size={20} />
      //   </TouchableOpacity>
      // </View>

      <View style={[styles.todo, {backgroundColor: '#FFE6E6'}]}>
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: todo?.completed ? '#28cd41' : '#ff3b30'},
          ]}></View>
        <View style={{flexDirection: 'column'}}>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: '#333333',
                textDecorationLine: todo?.completed ? 'line-through' : 'none',
              }}>
              {todo?.task}
            </Text>
            <View style={styles.problemInfo}>
              <Text style={{fontSize: 12, color: '#808080'}}>
                Time:{' '}
                {moment(todo?.createdAt).utcOffset('+0200').format('HH:mm')}h
              </Text>
              <Text style={{fontSize: 12, color: '#808080'}}>
                Date: {moment(todo?.createdAt).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={{flex: 1}}></View> */}
        <View style={{flexDirection: 'row'}}>
          {!todo?.completed && (
            <TouchableOpacity
              style={[styles.actionIcon]}
              onPress={() => todoComplete(todo?.id)}>
              <Icon name="done" color="white" size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionIcon, {backgroundColor: '#BD1616'}]}
            onPress={() => todoDelete(todo?.id)}>
            <Icon name="delete" color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const randomRGB = () => {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return `rgb(${red}, ${green}, ${blue})`;
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
        createdAt: moment().toDate(),
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
      <LinearGradient colors={['#77070A', '#C2080B']} style={{height: '100%'}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Todo App</Text>
          <Icon
            name="delete-sweep"
            size={30}
            color="black"
            onPress={deleteAll}></Icon>
        </View>
        <View style={styles.footer}>
          <View style={styles.input}>
            <TextInput
              placeholder="Add Todo"
              onChangeText={text => setTextInput(text)}
              value={textInput}
            />
          </View>
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.addButton}>
              <Icon name="add" size={50} color="white"></Icon>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 20, paddingBottom: 100}}
          data={todos}
          renderItem={({item}) => <ListItem todo={item} />}
        />
      </LinearGradient>
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
    //position: 'absolute',
    //bottom: 0,
    //width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    //paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    elevation: 5,
  },
  input: {
    backgroundColor: '#FFE6E6',
    elevation: 5,
    flex: 1,
    height: 50,
    //marginVertical: 20,
    //marginRight: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#ff3b30',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
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
  todo: {
    height: 80,
    marginBottom: 20,
    padding: 10,
    paddingLeft: 22,
    borderRadius: 10,
    //backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    elevation: 12,
    backgroundColor: 'white',
  },
  statusIndicator: {
    position: 'absolute',
    width: 12,
    height: 80,
    left: 0,
    top: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  problemInfo: {},
});

export default App;
