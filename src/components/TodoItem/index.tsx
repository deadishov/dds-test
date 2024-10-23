import React from 'react'
import styles from './TodoItem.module.scss'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Checkbox } from 'antd'
import moment from 'moment'
import { ItemToEdit, TodoItem as TodoItemType } from '../../@types/types'

interface TodoItemProps {
    item: TodoItemType,
    onEdit: (item: ItemToEdit) => void,
    onDelete: (id: string) => void,
    onToggle: (id: string) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onEdit, onDelete, onToggle }) => {

    return (
        <div className={styles.todo}>
            <div className={styles.todoTitleArea}>
                <p className={styles.todoParam}>{item.title}</p>
            </div>
            <div className={styles.todoDateArea}>
                <p className={styles.todoParam}>{moment(item.dueDate).format('DD.MM.YYYY')}</p>
            </div>
            <div className={styles.todoTools}>
                <div style={{ display: "flex", gap: "5px" }}>
                    <Checkbox onChange={() => onToggle(item.id)} checked={item.isCompleted} />
                </div>
                <EditOutlined onClick={() => onEdit(item)} style={{ cursor: 'pointer' }} />
                <DeleteOutlined onClick={() => onDelete(item.id)} style={{ cursor: 'pointer' }} />
            </div>
        </div>
    )
}

export default TodoItem
