import React, { useCallback, useState } from 'react'
import styles from './TodoList.module.scss'
import TodoItem from '../TodoItem'
import { useToggleTodoMutation } from '../../redux/services/todoApi'
import { TodoItem as TodoItemType } from '../../@types/types'

interface TodoProps {
    list: TodoItemType[],
    setOpenModal: () => void,
    setItem: (item: TodoItemType) => void,
    refetchData: () => void,
    openDeleteModal: (id: string) => void,
}

const TodoList: React.FC<TodoProps> = React.memo(({ list, setOpenModal, setItem, refetchData, openDeleteModal }) => {
    const [toggledItem, setToggledItem] = useState<string | null>(null)
    const [toggleTodo, { isLoading: isToggleLoading }] = useToggleTodoMutation()

    const editItemOpen = useCallback((item: TodoItemType) => {
        setOpenModal()
        setItem(item)
    }, [setItem, setOpenModal])

    const deleteItemOpen = useCallback((id: string) => {
        openDeleteModal(id)
    }, [])

    const onToggle = useCallback(async (id: string) => {
        setToggledItem(id)
        try {
            await toggleTodo(id)
            refetchData()
        } catch (error) {
            console.error(error)
        }
    }, [])

    return (
        <div className={styles.todoBlock}>
            {list.length ? <div className={styles.todoListHeader}>
                <p className={styles.todoListHeaderTitle}>Title:</p>
                <p className={styles.todoListHeaderDate}>Due date:</p>
            </div>
                :
                <p className={styles.todoNoTasks}>There's no tasks at this moment :)</p>
            }
            {list.length ? <ul className={styles.todoList}>
                {list?.map((item: TodoItemType) => (
                    <TodoItem
                        key={item.id}
                        toggledItem={toggledItem}
                        isToggleLoading={isToggleLoading}
                        onToggle={(id: string) => onToggle(id)}
                        onDeleteOpen={(id: string) => deleteItemOpen(id)}
                        item={item} onEdit={editItemOpen} />
                ))}
            </ul>
                :
                null}
        </div>
    )
})

export default TodoList
