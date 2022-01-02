import React from 'react'
import TextField from '@mui/material/TextField'

export default (props) => {
    const { customOnValueChanged, field, errors, item: { subType, id, label, props: itemProps } } = props
    return <TextField
        label={label}
        variant="outlined"
        {...field}
        className={`${errors[id] ? 'bg-red-100' : ''}`}
        type={subType}
        onChange={({ target: { value } }) => customOnValueChanged(value)}
        {...itemProps} />
    /*
    return <input
        {...field}
        type={subType}
        className={`input input-bordered focus:ring-2 focus:ring-primary input-lg  ${errors[id] ? 'bg-red-100 border-red-600' : ''}`}
    />
    */
}