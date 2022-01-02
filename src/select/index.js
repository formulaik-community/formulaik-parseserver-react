import React from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default (props) => {
    const { initialValues, values, customOnValueChanged, field, errors, item: { label, id, props: itemProps } } = props

    const { options, } = itemProps
    return <Select
        labelId={id}
        id={id}
        className={` ${errors[id] ? 'bg-red-100 select-error' : ''}`}
        value={values[id] ? values[id] : initialValues[id]}
        label={label}
        onChange={({ target: { value } }) => customOnValueChanged(value)}>
        {options.map((option) =>
            <MenuItem value={option.value}>{option.label}</MenuItem>
        )}
    </Select>

}