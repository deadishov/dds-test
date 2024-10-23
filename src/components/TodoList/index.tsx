import React from 'react'
import styles from './TodoList.module.scss'
import TodoItem from '../TodoItem'
import { useDeleteTodoMutation, useToggleTodoMutation } from '../../redux/services/todoApi'
import { ItemToEdit, TodoItem as TodoItemType } from '../../@types/types'
import { NotificationPlacement } from 'antd/es/notification/interface'
import { notification } from 'antd'

interface TodoProps {
    list: TodoItemType[],
    setOpenModal: () => void,
    setItem: (item: ItemToEdit) => void,
    refetchData: () => void
}

const TodoList: React.FC<TodoProps> = ({ list, setOpenModal, setItem, refetchData }) => {
    const [deleteTodo] = useDeleteTodoMutation()
    const [toggleTodo] = useToggleTodoMutation()

    const onDeleteSuccessNotification = (placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task deleted from the list.',
            placement,
            duration: 3,
        });
    };

    const editItemOpen = (item: ItemToEdit) => {
        setOpenModal()
        setItem(item)
    }

    const onDeleteItem = async (id: string) => {
        try {
            await deleteTodo(id)
            refetchData()
            onDeleteSuccessNotification('top')
        } catch (error) {
            console.error(error)
        }
    }

    const onToggle = async (id: string) => {
        try {
            await toggleTodo(id)
            refetchData()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.todoBlock}>
            {list.length ? <div className={styles.todoListHeader}>
                <p className={styles.todoListHeaderTitle}>Title:</p>
                <p className={styles.todoListHeaderDate}>Due date:</p>
            </div>
                :
                <p style={{ fontSize: 20, fontWeight: 600, marginTop: 200 }}>There's no tasks at this moment :)</p>
            }
            <ul className={styles.todoList}>
                {list?.map((item: TodoItemType) => (
                    <TodoItem onToggle={(id: string) => onToggle(id)} onDelete={(id: string) => onDeleteItem(id)} item={item} onEdit={editItemOpen} />
                ))}
            </ul>
        </div>
    )
}

export default TodoList
