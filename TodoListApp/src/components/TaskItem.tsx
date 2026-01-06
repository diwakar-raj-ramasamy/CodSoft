import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onPress: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onPress }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return '#FF5252';
            case 'Medium': return '#FFC107';
            case 'Low': return '#4CAF50';
            default: return '#757575';
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(task)}>
            <TouchableOpacity onPress={() => onToggleComplete(task.id)} style={styles.checkbox}>
                <Ionicons
                    name={task.isCompleted ? "checkbox" : "square-outline"}
                    size={24}
                    color={task.isCompleted ? "#4CAF50" : "#757575"}
                />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[styles.title, task.isCompleted && styles.completedText]}>
                    {task.title}
                </Text>
                <View style={styles.details}>
                    <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
                        {task.priority}
                    </Text>
                    {task.dueDate && (
                        <Text style={styles.date}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                    )}
                </View>
            </View>

            <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={24} color="#FF5252" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 2, // Shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    checkbox: {
        padding: 4,
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212121',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#9E9E9E',
    },
    details: {
        flexDirection: 'row',
        marginTop: 4,
        alignItems: 'center',
    },
    priority: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
    },
    date: {
        fontSize: 12,
        color: '#757575',
    },
    deleteBtn: {
        padding: 8,
    },
});
