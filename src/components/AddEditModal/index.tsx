import { DatePicker, Input, Modal, notification } from 'antd'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import { useAddTodoMutation, useEditTodoMutation } from '../../redux/services/todoApi'
import { ItemToEdit } from '../../@types/types'
import TextArea from 'antd/es/input/TextArea'
import { NotificationPlacement } from 'antd/es/notification/interface'

interface ModalProps {
    isOpen: boolean,
    setIsOpen: (state: boolean) => void,
    itemToEdit: ItemToEdit | null,
    resetItemToEdit: () => void,
    refetchData: () => void
}

const AddEditModal: React.FC<ModalProps> = ({ isOpen, itemToEdit, resetItemToEdit, setIsOpen, refetchData }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState<Moment | null>(null)
    const [addTodoRequest] = useAddTodoMutation()
    const [editTodoRequest] = useEditTodoMutation()

    const onAddSuccessNotification = (placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task added to the list.',
            placement,
            duration: 3,
        });
    };

    const onEditSuccessNotification = (placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task edited.',
            placement,
            duration: 3,
        });
    };

    const onAddNewTask = async (item: any) => {
        try {
            await addTodoRequest(item)
            resetItemToEdit()
            setDescription('')
            setName('')
            setDate(null)
            setIsOpen(false)
            onAddSuccessNotification('top')
            refetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const onEditTask = async (item: any) => {
        console.log('it', item);

        try {
            await editTodoRequest(item)
            resetItemToEdit()
            setIsOpen(false)
            refetchData()
            onEditSuccessNotification('top')
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (itemToEdit) {
            setDescription(itemToEdit.description)
            setName(itemToEdit.title)
            setDate(moment(itemToEdit.dueDate))
        } else {
            setName('')
            setDescription('')
            setDate(null)
        }
    }, [itemToEdit])

    const handleCancel = () => {
        if (itemToEdit) {
            resetItemToEdit()
        }
        setName('')
        setDescription('')
        setDate(null)
        setIsOpen(false)
    }

    console.log('date', date?.toISOString());


    return (
        <Modal
            title={itemToEdit ? 'Edit Todo' : 'Create New Todo'}
            open={isOpen}
            onOk={() => itemToEdit ? onEditTask({ id: itemToEdit.id, title: name, dueDate: date?.toISOString(), description: description }) : onAddNewTask({ title: name, dueDate: date?.toISOString() || '', description: description })}
            confirmLoading={false}
            onCancel={handleCancel}
        >
            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextArea
                style={{ marginTop: 10 }}
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <DatePicker
                style={{ width: '100%', marginTop: 10 }}
                value={date}
                onChange={(date) => setDate(date)}
            />
        </Modal>
    )
}

export default AddEditModal
