import React from 'react'
import styles from './AddButton.module.scss'

const AddButton = ({ clickAction }: { clickAction: () => void }) => {
    return (
        <button onClick={clickAction} className={styles.button}>
            Add new task
        </button>
    )
}

export default AddButton
