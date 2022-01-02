import React from 'react'
import Rating from '@mui/material/Rating'

export default (props) => {
  const { values, customOnValueChanged,
    item: { id, label, props: itemProps } } = props

  return <Rating
    name="simple-controlled"
    value={values[id]}
    size="large"
    onChange={(event, newValue) => {
      customOnValueChanged(newValue)
    }}
    {...itemProps}
  />
}