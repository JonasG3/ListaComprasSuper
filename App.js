import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Keyboard, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList,AsyncStorage } from "react-native";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [maxTotalValue, setMaxTotalValue] = useState(""); // Valor máximo para todas as compras

  const subtotal = tasks.reduce((sum, task) => sum + (task.completed ? 0 : task.price), 0); // Subtotal das compras não concluídas

  // Função para adicionar um item
  async function addTask() {
    if (newTask.trim() === "" || newPrice.trim() === "") {
      Alert.alert("Campos em branco", "Por favor, preencha todos os campos.");
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert("Preço inválido", "Por favor, insira um preço válido.");
      return;
    }

    if (subtotal + price > parseFloat(maxTotalValue)) {
      Alert.alert("Limite excedido", "A soma dos itens ultrapassa o valor máximo permitido.");
      return;
    }

    const search = tasks.filter(task => task.text === newTask);

    if (search.length !== 0) {
      Alert.alert("Atenção", "Nome da tarefa repetido!");
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask,
      price: price,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setNewPrice("");
    Keyboard.dismiss();
  }

  // Função para remover um item
  async function removeTask(item) {
    Alert.alert(
      "Deletar Task",
      "Tem certeza que deseja remover esta anotação?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => setTasks(tasks.filter(task => task.id !== item.id))
        }
      ],
      { cancelable: false }
    );
  }

  // Alternar o estado de conclusão de um item
  const toggleTaskCompletion = (item) => {
    setTasks(tasks.map(task => 
      task.id === item.id ? { ...task, completed: !task.completed } : task
    ));
  };

  /*
  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem("task");

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregaDados();
  }, []);

  useEffect(() => {
    async function salvaDados() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    salvaDados();
  }, [task]);
*/

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior="padding"
      style={{ flex: 1 }}
      enabled={Platform.OS === "ios"}
    >
      <View style={styles.container}>
        
        <View style={styles.TitiloConteiner}>
          <Text style={styles.Titulo}>Lista de Compras</Text>
        </View>
        
        <View style={styles.Body}>
          <FlatList
            data={tasks}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.FlatList}
            renderItem={({ item }) => (
              <View style={styles.ContainerView}>
                <TouchableOpacity onPress={() => toggleTaskCompletion(item)}>
                  <Text style={[styles.Texto, item.completed && styles.completedText]}>
                    {item.text} - R${item.price.toFixed(2)}
                  </Text>                
                </TouchableOpacity>                
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialIcons name="delete-forever" size={25} color="blue" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={styles.Form}>
          <TextInput
            style={styles.Input}
            placeholderTextColor="#999"
            autoCorrect={true}
            value={newTask}
            placeholder="Adicione um produto"
            maxLength={25}
            onChangeText={text => setNewTask(text)}
          />
          <TextInput
            style={styles.Input}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={newPrice}
            placeholder="Preço"
            onChangeText={text => setNewPrice(text)}
          />
          <TouchableOpacity style={styles.Button} onPress={addTask}>
            <AntDesign name="pluscircle" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.maxValueContainer}>
          <Text style={styles.maxValueLabel}>Valor máximo para as compras:</Text>
          <TextInput
            style={styles.maxValueInput}
            placeholder="Valor máximo total (R$)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={maxTotalValue}
            onChangeText={setMaxTotalValue}
          />
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Subtotal: R${subtotal.toFixed(2)}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 0,
    backgroundColor: "#FFF"
  },
  Body: {
    flex: 1
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#eee"
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginLeft: 5
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10
  },
  FlatList: {
    flex: 1,
    marginTop: 5,
  },
  Texto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center"
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999"
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee"
  },
  subtotalContainer: {
    padding: 10,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: "#eee"
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  maxValueContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  maxValueLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5, // Espaçamento entre o texto e o campo de input
  },
  maxValueInput: {
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  Titulo: {
    textAlign:"center",
    padding:25,
    fontSize: 30,
    fontWeight: "bold",
    color: "blue",
    
  },
  TitiloConteiner: {
    marginBottom: 0,
    padding: 0,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 15,
    borderColor: "#eee",
  }
});