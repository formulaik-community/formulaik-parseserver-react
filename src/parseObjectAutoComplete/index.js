import React, { useState } from 'react'
import Formulaik from '@yelounak/formulaik-react'
//import Formulaik from 'components/shared/formulaik-core'
import FormulaikMui from '@yelounak/formulaik-react-mui'
//import FormulaikSpecific from 'components/shared/formulaik'
import * as Yup from 'yup'

const fetchItems = async ({ search, sort, filter, className, include = [], exclude = [], queryHook, data, cache }) => {
  const cachedItems = cache && cache.get({ search, key: className })
  if (cachedItems) {
    return cachedItems
  }
  console.log('fetchItems: ', className)
  if (!className) {
    return []
  }

  if (search && search.length < 2) {
    return []
  }

  const _className = (typeof className === 'function') ? className({ data }) : className
  console.log('fetchItems: _className', _className)
  if (!_className) {
    return []
  }
  const query = new Parse.Query(_className)
  switch (sort) {
    case 'desc':
      query.descending('createdAt')
      break
    default:
      query.ascending('createdAt')
      break
  }


  queryHook && queryHook({ query, search, sort, filter })

  if (filter !== 'all') {
    //_query.startsWith('mimeType', filter)
  }
  //_query.fullText('name', controls.search.query ? controls.search.query : '')
  query.include(include)
  query.exclude(exclude)
  var results = await query.find()
  results = results ? results : []
  cache && cache.add({ search, key: className, results })
  return results
}

export default (props) => {
  const {
    value,
    onValueChanged,
    error,
    item: { label, params }
  } = props

  const { className, include = [], exclude = [], queryHook, getOptionLabel, multiple = true } = params
  var data = value
  if (!data) {
    data = multiple ? [] : null
  }

  if (Array.isArray(data)) {
    data = data.filter(a => a)
  }

  const validationSchema = () => {
    return Yup.object().shape({
      items: multiple ? Yup.array() : Yup.object()
    })
  }

  const inputs = [
    {
      type: 'autocomplete',
      schema: 'items',
      id: 'items',
      label: label,
      params: {
        multiple,
        filterSelectedOptions: true,
        fetcher: async ({ value }) => {
          return fetchItems({ search: value, className, include, exclude, queryHook, data, cache: props.cache })
        },
        isOptionEqualToValue: (option, value) => { return (option.id === value.id) },
        getOptionLabel,
      }
    },
  ]

  const initialValues = {
    items: data
  }

  const onValuesChanged = (__values) => {
    onValueChanged && onValueChanged(__values.items)
  }

  return <div className={`w-full ${error ? 'bg-red-100 ' : ''}`}><Formulaik
    componentsLibraries={[FormulaikMui]}
    initialValues={initialValues}
    validationSchema={validationSchema}
    inputs={inputs}
    onValuesChanged={onValuesChanged}
    hideErrors
    disabled={props.disabled}
    readOnly={props.readOnly} />
  </div>
}
