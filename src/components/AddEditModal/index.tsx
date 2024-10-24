import { Button, DatePicker, Input, Modal, notification, Form } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useAddTodoMutation, useDeleteTodoMutation, useEditTodoMutation } from '../../redux/services/todoApi';
import { ItemToAdd, ItemToEdit, TodoItem } from '../../@types/types';
import styles from './AddEditModal.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    itemToEdit: TodoItem | null;
    resetItemToEdit: () => void;
    refetchData: () => void;
    itemToDelete: string | null;
    closeDeleteModal: () => void;
}

const AddEditModal: React.FC<ModalProps> = React.memo(({
    isOpen,
    itemToEdit,
    resetItemToEdit,
    closeModal,
    refetchData,
    itemToDelete,
    closeDeleteModal,
}) => {
    const [form] = Form.useForm();
    const [addTodoRequest, { isLoading: isLoadingAdd }] = useAddTodoMutation();
    const [editTodoRequest, { isLoading: isLoadingEdit }] = useEditTodoMutation();
    const [deleteTodo, { isLoading: isLoadingDelete }] = useDeleteTodoMutation();

    const onDeleteSuccessNotification = useCallback((placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task deleted from the list.',
            placement,
            duration: 3,
        });
    }, []);

    const onAddSuccessNotification = useCallback((placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task added to the list.',
            placement,
            duration: 3,
        });
    }, []);

    const onEditSuccessNotification = useCallback((placement: NotificationPlacement) => {
        notification.success({
            message: 'Success!',
            description: 'Task edited.',
            placement,
            duration: 3,
        });
    }, []);

    const onAddNewTask = useCallback(async (item: ItemToAdd) => {
        try {
            await addTodoRequest(item);
            form.resetFields();
            resetItemToEdit();
            closeModal();
            onAddSuccessNotification('top');
            refetchData();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const onEditTask = useCallback(async (item: ItemToEdit) => {
        try {
            await editTodoRequest(item);
            form.resetFields();
            resetItemToEdit();
            closeModal();
            refetchData();
            onEditSuccessNotification('top');
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (itemToEdit) {
            form.setFieldsValue({
                name: itemToEdit.title,
                description: itemToEdit.description,
                dueDate: moment(itemToEdit.dueDate),
            });
        }
    }, [itemToEdit, form]);

    const handleCancel = useCallback(() => {
        form.resetFields();
        resetItemToEdit();
        if (itemToDelete) {
            closeDeleteModal();
        }
        closeModal();
    }, []);

    const onDeleteItem = useCallback(async (id: string) => {
        try {
            await deleteTodo(id);
            closeDeleteModal();
            refetchData();
            closeModal();
            onDeleteSuccessNotification('top');
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const { name, description, dueDate } = values;
            const formattedDate = dueDate?.toISOString() || '';

            if (itemToEdit) {
                onEditTask({ id: itemToEdit.id, title: name, dueDate: formattedDate, description });
            } else {
                onAddNewTask({ title: name, dueDate: formattedDate, description });
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }, [itemToEdit]);

    return (
        <Modal
            title={itemToEdit ? 'Edit Todo' : 'Create New Todo'}
            open={isOpen}
            confirmLoading={isLoadingAdd || isLoadingEdit || isLoadingDelete}
            onCancel={handleCancel}
            footer={[
                itemToDelete ? (
                    <>
                        <Button
                            key="delete"
                            type="primary"
                            danger
                            loading={isLoadingDelete}
                            onClick={() => onDeleteItem(itemToDelete)}
                        >
                            Delete
                        </Button>
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            loading={itemToEdit ? isLoadingEdit : isLoadingAdd}
                            key="ok"
                            type="primary"
                            onClick={handleOk}
                        >
                            {itemToEdit ? 'Edit' : 'Create'}
                        </Button>
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </>
                ),
            ]}
        >
            {itemToDelete === null ? (
                <Form
                    form={form}
                    layout="vertical"
                    className={styles.modalForm}
                    initialValues={{
                        name: '',
                        description: '',
                        dueDate: null,
                    }}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter the description' }]}
                    >
                        <TextArea placeholder="Description" />
                    </Form.Item>
                    <Form.Item
                        label="Due Date"
                        name="dueDate"
                        rules={[{ required: true, message: 'Please select the due date' }]}
                    >
                        <DatePicker className={styles.modalDatePicker} />
                    </Form.Item>
                </Form>
            ) : (
                <div>
                    <p>Are you sure you want to delete this task?</p>
                </div>
            )}
        </Modal>
    );
});

export default AddEditModal;