import React from 'react'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

export default (props) => {
    const {
        values,
        customOnValueChanged,
        errors,
        item: { id, props: itemProps }
    } = props

    return <JSONInput
        id='a_unique_id'
        placeholder={values[id]}
        onChange={(val) => {
            const { json } = val
            customOnValueChanged(json)
        }}
        locale={locale}
        // colors={darktheme}
        height='550px'
        className={` ${errors[id] ? 'bg-red-100 border-red-600' : ''}`}
        {...itemProps}
    />


}