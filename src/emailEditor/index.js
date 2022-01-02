import React from 'react'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Editor from './editor'
import Preview from './preview'

export default (props) => {
    const {
        initialValues,
        values,
        customOnValueChanged,
        errors,
        item: { id, props: itemProps }
    } = props

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const initialDesign = () => {
        const initialValue = initialValues[id]
        if (!initialValue) {
            return null
        }
        return initialValue.design
    }

    const initialHtml = () => {
        const initialValue = initialValues[id]
        if (!initialValue) {
            return null
        }
        return initialValue.html
    }

    return (
        <div>
            <Button onClick={handleOpen}>Edit</Button>
            <Preview html={initialHtml()} />
            <Modal
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Editor {...props}
                    closeModal={handleClose}
                    onSaved={customOnValueChanged}
                    initialDesign={initialDesign()} />
            </Modal>
        </div>
    )
}