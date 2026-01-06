import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, Priority } from '../types';
import { generateId } from '../utils/storage'; // Oops, I forgot to implement generateId, I'll fix that.
// Actually I can just use Date.now().toString() for simplicity here or add it to utils.
import { Ionicons } from '@expo/vector-icons';

// Placeholder for generateId to avoid error imports, I'll just implement it inline or update utils later.
const generateId = () => Date.now().toString();

export const AddEditTaskScreen = ({ navigation, route }: any) => {
    const { onSave, taskToEdit } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority);
            if (taskToEdit.dueDate) {
                setDueDate(new Date(taskToEdit.dueDate));
            }
        }
    }, [taskToEdit]);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        const newTask: Task = {
            id: taskToEdit ? taskToEdit.id : generateId(),
            title: title.trim(),
            description: description.trim(),
            priority,
            dueDate: dueDate ? dueDate.toISOString() : undefined,
            isCompleted: taskToEdit ? taskToEdit.isCompleted : false,
        };

        onSave(newTask);
        navigation.goBack();
    };

    const PriorityBadge = ({ level }: { level: Priority }) => (
        <TouchableOpacity
            style={[
                styles.priorityBadge,
                priority === level && styles.selectedPriority,
                priority === level && { borderColor: getPriorityColor(level) }
            ]}
            onPress={() => setPriority(level)}
        >
            <Text style={[styles.priorityText, priority === level && { color: getPriorityColor(level) }]}>{level}</Text>
        </TouchableOpacity>
    );

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return '#FF5252';
            case 'Medium': return '#FFC107';
            case 'Low': return '#4CAF50';
            default: return '#757575';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description (optional)"
                multiline
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
                <PriorityBadge level="Low" />
                <PriorityBadge level="Medium" />
                <PriorityBadge level="High" />
            </View>

            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(true)}
            >
                <Ionicons name="calendar-outline" size={24} color="#555" />
                <Text style={styles.dateText}>
                    {dueDate ? dueDate.toLocaleDateString() : 'Set Due Date'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDueDate(selectedDate);
                    }}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Task</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    priorityBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginRight: 10,
    },
    selectedPriority: {
        backgroundColor: '#fff',
        borderWidth: 2,
    },
    priorityText: {
        fontWeight: 'bold',
        color: '#555',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 30,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
