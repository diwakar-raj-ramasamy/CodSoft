import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_STORAGE_KEY = '@todo_tasks';

export const getTasks = async (): Promise<Task[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load tasks', e);
        return [];
    }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save tasks', e);
    }
};

export const generateId = (): string => Date.now().toString();
