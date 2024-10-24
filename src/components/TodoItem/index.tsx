import React from 'react'
import styles from './TodoItem.module.scss'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Checkbox, Spin } from 'antd'
import moment from 'moment'
import { TodoItem as TodoItemType } from '../../@types/types'

interface TodoItemProps {
    item: TodoItemType,
    onEdit: (item: TodoItemType) => void,
    onDeleteOpen: (id: string) => void,
    onToggle: (id: string) => void,
    isToggleLoading: boolean,
    toggledItem: null | string
}

const TodoItem: React.FC<TodoItemProps> = React.memo(({ item, onEdit, onDeleteOpen, onToggle, isToggleLoading, toggledItem }) => {

    return (
        <div className={styles.todo}>
            <div className={styles.todoTitleArea}>
                <p className={styles.todoParam}>{item.title}</p>
            </div>
            <div className={styles.todoDateArea}>
                <p className={styles.todoParam}>{moment(item.dueDate).format('DD.MM.YYYY')}</p>
            </div>
            <div className={styles.todoTools}>
                <div className={styles.todoToolsCheckbox}>
                    <Spin spinning={isToggleLoading && (toggledItem === item.id)} size="default">
                        <Checkbox
                            onChange={() => onToggle(item.id)}
                            checked={item.isCompleted}
                        />
                    </Spin>
                </div>
                <EditOutlined onClick={() => onEdit(item)} className={styles.todoToolsIcon} />
                <DeleteOutlined onClick={() => onDeleteOpen(item.id)} className={styles.todoToolsIcon} />
            </div>
        </div>
    )
})

export default TodoItem
