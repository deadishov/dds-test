import { Button, Modal } from 'antd'
import React, { useCallback } from 'react'
import { useDeleteTodoMutation } from '../../redux/services/todoApi';
import styles from './DeleteModal.module.scss'

interface DeleteModalProps {
    closeModal: () => void,
    refetchData: () => void,
    itemToDelete: string | null
}

const DeleteModal: React.FC<DeleteModalProps> = ({ closeModal, refetchData, itemToDelete }) => {
    const [deleteTodo, { isLoading }] = useDeleteTodoMutation();

    const handleCancel = useCallback(() => {
        closeModal();
    }, [closeModal]);

    const onDeleteItem = useCallback(async (id: string) => {
        try {
            await deleteTodo(id);
            refetchData();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }, [refetchData, closeModal]);
    return (
        <Modal
            title='Delete todo'
            open={itemToDelete ? true : false}
            confirmLoading={isLoading}
            onCancel={handleCancel}
            footer={[
                <div className={styles.modalButtons} key={'delete'}>
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        loading={isLoading}
                        onClick={() => itemToDelete && onDeleteItem(itemToDelete)}
                    >
                        Delete
                    </Button>
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            ]}
        >
            <div>
                <p>Are you sure you want to delete this task?</p>
            </div>
        </Modal>
    )
}

export default DeleteModal
