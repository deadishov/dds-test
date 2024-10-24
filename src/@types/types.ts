export interface TodoItem {
    id: string,
    isCompleted: boolean,
    title: string,
    description: string,
    dueDate: string
}

export interface ItemToEdit {
    id: string,
    title: string,
    dueDate: string,
    description: string,
}

export interface ItemToAdd {
    title: string,
    dueDate: string,
    description: string,
}