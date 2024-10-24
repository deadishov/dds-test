import React, { useCallback, useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { FileDoneOutlined } from '@ant-design/icons'
import styles from './MainScreen.module.scss'
import { useGetTodoListQuery } from '../../redux/services/todoApi'
import TodoList from '../TodoList'
import AddEditModal from '../AddEditModal'
import { TodoItem } from '../../@types/types'
import DeleteModal from '../DeleteModal'

const MainScreen = React.memo(() => {
  const [openModal, setOpenModal] = useState(false)
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [todoList, setTodoList] = useState<TodoItem[]>([])
  const { data, refetch, isLoading } = useGetTodoListQuery()

  const openCreateNewTask = useCallback(() => {
    if (editingItem) {
      setEditingItem(null)
    }
    setOpenModal(true)
  }, [editingItem])

  useEffect(() => {
    if (data) {
      setTodoList(data)
    }
  }, [data])

  return (
    <>
      <Header className={styles.mainScreenHeader}>
        <p>TODO MANAGER</p>
        <FileDoneOutlined />
      </Header>
      <div className={`${styles.mainScreen} container`}>

        {isLoading ?
          <Spin className={styles.mainScreenSpin} size="large" />
          :
          <>
            <TodoList
              openDeleteModal={(id: string) => setItemToDelete(id)}
              refetchData={refetch}
              setOpenModal={() => setOpenModal(true)}
              setItem={(item: TodoItem) => setEditingItem(item)}
              list={todoList}
            />
            <Button className={styles.mainScreenAddButton} type='primary' onClick={openCreateNewTask}>
              Add new task
            </Button>
          </>}
      </div>
      <AddEditModal
        refetchData={refetch}
        closeModal={() => setOpenModal(false)}
        isOpen={openModal}
        itemToEdit={editingItem}
        resetItemToEdit={() => setEditingItem(null)} />
      <DeleteModal
        itemToDelete={itemToDelete}
        closeModal={() => setItemToDelete(null)}
        refetchData={refetch} />
    </>
  )
})

export default MainScreen
