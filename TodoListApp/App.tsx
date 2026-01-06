import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddEditTaskScreen } from './src/screens/AddEditTaskScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'To-Do List' }}
        />
        <Stack.Screen
          name="AddEditTask"
          component={AddEditTaskScreen}
          options={({ route }: any) => ({
            title: route.params?.taskToEdit ? 'Edit Task' : 'New Task'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
