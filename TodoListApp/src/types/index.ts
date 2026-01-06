export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    priority: Priority;
    dueDate?: string; // ISO string
}
