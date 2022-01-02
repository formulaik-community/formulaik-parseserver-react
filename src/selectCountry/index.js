import React from 'react'
import ReactFlagsSelect from 'react-flags-select'

export default (props) => {
  const { customOnValueChanged, values, errors, item: { label, id, props: itemProps } } = props

  return <ReactFlagsSelect
    selected={values[id]}
    onSelect={customOnValueChanged}
    {...itemProps}
    className={`  w-full focus:ring-primary  ${errors[id] ? 'bg-red-100 select-error' : ''}`}
  />
}