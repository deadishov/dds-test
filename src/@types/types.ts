export interface TodoItem {
    id: string,
    isCompleted: boolean,
    title: string,
    description: string,
    dueDate: string
}

export type ItemToEdit = Omit<TodoItem, 'isCompleted'>


export type ItemToAdd = Omit<TodoItem, 'id' | 'isCompleted'>