import React from 'react'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

export default (props) => {
    const { customOnValueChanged, initialValues, values, field, errors, item: { label, id, props: itemProps } } = props

    return <FormGroup>
        <FormControlLabel control={<Switch
            color="default"

            checked={values[id]}
            onChange={({ target: { checked } }) => {
                customOnValueChanged(checked)
            }} />}
            label={label}
            {...itemProps} />
    </FormGroup>
}