import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../types';
import { getTasks, saveTasks } from '../utils/storage';

export const HomeScreen = ({ navigation }: any) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const loadTasks = async () => {
        const loadedTasks = await getTasks();
        setTasks(sortTasks(loadedTasks));
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    const sortTasks = (taskList: Task[]) => {
        return taskList.sort((a, b) => {
            // 1. Completion status (Active first)
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;

            // 2. Priority (High > Medium > Low)
            const priorityOrder = { High: 0, Medium: 1, Low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }

            return 0;
        });
    };

    const handleToggleComplete = async (id: string) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        setTasks(sortTasks(updatedTasks));
        await saveTasks(updatedTasks);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updatedTasks = tasks.filter(task => task.id !== id);
                        setTasks(updatedTasks);
                        await saveTasks(updatedTasks);
                    }
                }
            ]
        );
    };

    const handleSaveTask = async (task: Task) => {
        const existingIndex = tasks.findIndex(t => t.id === task.id);
        let updatedTasks;
        if (existingIndex >= 0) {
            updatedTasks = [...tasks];
            updatedTasks[existingIndex] = task;
        } else {
            updatedTasks = [...tasks, task];
        }
        setTasks(sortTasks(updatedTasks));
        await saveTasks(updatedTasks);
    };

    return (
        <View style={styles.container}>
            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="clipboard-outline" size={80} color="#ddd" />
                    <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            onToggleComplete={handleToggleComplete}
                            onDelete={handleDelete}
                            onPress={(task) => navigation.navigate('AddEditTask', { taskToEdit: task, onSave: handleSaveTask })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddEditTask', { onSave: handleSaveTask })}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingBottom: 80,
        paddingTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: '#999',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#2196F3',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
