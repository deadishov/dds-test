import { Button, DatePicker, Input, Modal, notification, Form } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect } from 'react';
import { useAddTodoMutation, useDeleteTodoMutation, useEditTodoMutation } from '../../redux/services/todoApi';
import { ItemToAdd, ItemToEdit, TodoItem } from '../../@types/types';
import styles from './AddEditModal.module.scss';
import TextArea from 'antd/es/input/TextArea';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    itemToEdit: TodoItem | null;
    resetItemToEdit: () => void;
    refetchData: () => void;
}

const AddEditModal: React.FC<ModalProps> = React.memo(({
    isOpen,
    itemToEdit,
    resetItemToEdit,
    closeModal,
    refetchData
}) => {
    const [form] = Form.useForm();
    const [addTodoRequest, { isLoading: isLoadingAdd }] = useAddTodoMutation();
    const [editTodoRequest, { isLoading: isLoadingEdit }] = useEditTodoMutation();

    const notify = useCallback((type: 'success' | 'error', message: string, description: string) => {
        notification[type]({
            message,
            description,
            placement: 'top',
            duration: 3,
        });
    }, []);

    const onAddNewTask = useCallback(async (item: ItemToAdd) => {
        try {
            await addTodoRequest(item);
            form.resetFields();
            resetItemToEdit();
            closeModal();
            notify('success', 'Success!', 'Task added to the list.');
            refetchData();
        } catch (error) {
            console.error(error);
        }
    }, [addTodoRequest, form, resetItemToEdit, closeModal, notify, refetchData]);

    const onEditTask = useCallback(async (item: ItemToEdit) => {
        try {
            await editTodoRequest(item);
            form.resetFields();
            resetItemToEdit();
            closeModal();
            notify('success', 'Success!', 'Task edited.');
            refetchData();
        } catch (error) {
            console.error(error);
        }
    }, [editTodoRequest, form, resetItemToEdit, closeModal, notify, refetchData]);

    useEffect(() => {
        if (itemToEdit) {
            form.setFieldsValue({
                name: itemToEdit.title,
                description: itemToEdit.description,
                dueDate: dayjs(itemToEdit.dueDate),
            });
        }
    }, [itemToEdit, form]);

    const handleCancel = useCallback(() => {
        form.resetFields();
        resetItemToEdit();
        closeModal();
    }, [form, resetItemToEdit, closeModal]);

    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const { name, description, dueDate } = values;
            const formattedDate = dueDate ? dayjs(dueDate).toISOString() : '';

            if (itemToEdit) {
                onEditTask({ id: itemToEdit.id, title: name, dueDate: formattedDate, description });
            } else {
                onAddNewTask({ title: name, dueDate: formattedDate, description });
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }, [itemToEdit, onAddNewTask, onEditTask, form]);

    return (
        <Modal
            title={itemToEdit ? 'Edit Todo' : 'Create New Todo'}
            open={isOpen}
            confirmLoading={isLoadingAdd || isLoadingEdit}
            onCancel={handleCancel}
            footer={[
                (
                    <div className={styles.modalButtons} key={'add-edit'}>
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
                    </div>
                ),
            ]}
        >
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
        </Modal>
    );
});

export default AddEditModal;
