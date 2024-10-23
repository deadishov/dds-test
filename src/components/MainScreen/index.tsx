import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { FileDoneOutlined } from '@ant-design/icons'
import styles from './MainScreen.module.scss'
import { useGetTodoListQuery } from '../../redux/services/todoApi'
import TodoList from '../TodoList'
import AddButton from '../AddButton'
import AddEditModal from '../AddEditModal'
import { ItemToEdit, TodoItem } from '../../@types/types'

const { Header } = Layout

const MainScreen = () => {
  const [openModal, setOpenModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ItemToEdit | null>(null)
  const [todoList, setTodoList] = useState<TodoItem[]>([])
  const { data, refetch } = useGetTodoListQuery()

  const openCreateNewTask = () => {
    if (editingItem) {
      setEditingItem(null)
    }
    setOpenModal(true)
  }

  useEffect(() => {
    if (data) {
      setTodoList(data)
    }
  }, [data])

  console.log("da", todoList);


  return (
    <>
      <Header style={{
        backgroundColor: "#4096ff",
        padding: "0 64px",
        display: "flex",
        justifyContent: "center",
        color: "#fff",
        alignItems: "center",
        gap: "10px"
      }}>
        <p>TODO MANAGER</p>
        <FileDoneOutlined />
      </Header>
      <div className={`${styles.mainScreen} container`}>
        <TodoList refetchData={refetch} setOpenModal={() => setOpenModal(true)} setItem={(item: ItemToEdit) => setEditingItem(item)} list={todoList} />
        <AddButton clickAction={openCreateNewTask} />
      </div>
      <AddEditModal
        refetchData={refetch}
        setIsOpen={(state: boolean) => setOpenModal(state)}
        isOpen={openModal}
        itemToEdit={editingItem}
        resetItemToEdit={() => setEditingItem(null)} />
    </>
  )
}

export default MainScreen
