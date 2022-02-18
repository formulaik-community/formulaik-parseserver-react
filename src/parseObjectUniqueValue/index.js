import React, { useState, useRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import CircularProgress from '@mui/material/CircularProgress'

const fetchItems = async ({ search, filter, className, data, queryHook }) => {
  console.log('fetchItems: ', className)
  if (!className) {
    return 0
  }

  if (search && search.length < 2) {
    return 0
  }

  const _className = (typeof className === 'function') ? className({ data }) : className
  console.log('fetchItems: _className', _className)
  if (!_className) {
    return 0
  }
  const query = new Parse.Query(_className)

  queryHook && queryHook({ query, search, filter })

  if (filter !== 'all') {
    //_query.startsWith('mimeType', filter)
  }
  //_query.fullText('name', controls.search.query ? controls.search.query : '')

  return query.count()
}


export default (props) => {
  const { onValueChanged, value: propsValue, field, errors, item: { id, label, props: itemProps } } = props
  const { className, queryHook, minLength = 3, maxLength = 20 } = itemProps
  const [data, setData] = useState(propsValue ? propsValue : { value: null, isValid: false, initialValue: '' })
  const initialValue = useRef(data.value)

  const [isLoading, setIsLoading] = useState(false)

  const onChange = async ({ target: { value } }) => {
    const _value = value.trim().toLowerCase()
    if (initialValue.current && (_value === initialValue.current)) {
      setIsLoading(false)
      const _data = { ...data, value: _value, isValid: true }
      setData(_data)
      onValueChanged && onValueChanged(_data)
      return
    }

    if (_value.length <= minLength || _value.length > maxLength) {
      setIsLoading(false)
      const _data = { ...data, value: _value, isValid: false }
      setData(_data)
      onValueChanged && onValueChanged(_data)
      return
    }

    setIsLoading(true)
    const count = await fetchItems({ search: _value, queryHook, className })
    setIsLoading(false)
    const _data = { ...data, value: _value, isValid: count === 0 }
    setData(_data)
    onValueChanged && onValueChanged(_data)
  }

  const adornment = () => {
    if (isLoading) {
      return <CircularProgress />
    }
    if (data.isValid) {
      return <CheckIcon color='green' />
    }

    return <ErrorIcon color='red' />
  }

  return <OutlinedInput
    label={label}
    variant="outlined"
    disabled={props.disabled}
    readOnly={props.readOnly}
    // {...field}
    value={data.value}
    className={`${(!data.isValid || errors[id]) ? 'bg-red-100' : 'bg-green-100'}`}
    onChange={onChange}
    placeholder={label}
    endAdornment={<InputAdornment position="end">{adornment()}</InputAdornment>}
  />
}
