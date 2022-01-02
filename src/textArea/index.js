import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export default (props) => {
    const { customOnValueChanged, field, errors, item: { subType, id } } = props

    return <TextareaAutosize
        {...field}
        onChange={({ target: { value } }) => customOnValueChanged(value)}
        className={`textarea h-24 textarea-bordered text-base ${errors[id] ? 'bg-red-100 border-red-600' : 'border-warmGray-400'}`}
    />
}