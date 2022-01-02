import React, { useState } from 'react'
import Formulaik from 'formulaik'
import FormulaikMui from 'formulaik-mui'

import * as Yup from 'yup'

import _ from 'underscore'

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default (props) => {
  const {
    values,
    customOnValueChanged,
    errors,

    item: { id, label, props: itemProps }
  } = props

  const item = values[id]
  const [error, setError] = useState(null)

  const validationSchema = Yup.object().shape({
    className: Yup.string()
      .min(1, 'Must contain at least 8 characters')
      .max(100, 'Must contain at most 18 characters'),
    value: Yup.object()
  })

  const formItemsProvider = [
    {
      isMulti: true,
      className: 'flex ',
      items: [
        ...itemProps.formItems,
        ...(itemProps.canRemove ?
          [{
            type: 'button',
            id: 'removeItem',
            label: 'Remove',
            className: 'ml-2 ',
            props: {
              onClick: () => {
                customOnValueChanged && customOnValueChanged({ isRemoved: true })
              }
            }
          },] : [])
      ]
    }
  ]


  const initialValues = {
    className: item ? item.className : null,
    value: item ? item.value : null,
  }

  const onValuesChanged = (values) => {
    const data = itemProps.onEntryValuesChangedHook({ values, data: item })
    customOnValueChanged && customOnValueChanged(data)
  }

  return <Formulaik
    componentsLibraries={[...itemProps.componentsLibraries, FormulaikMui]}
    initialValues={initialValues}
    validationSchema={validationSchema}
    formItemsProvider={formItemsProvider}
    onValuesChanged={onValuesChanged}
    error={error} />
}