import React from 'react'
import Formulaik from '@formulaik-community/formulaik-engine-react'
//import Formulaik from 'components/shared/formulaik-core'
import FormulaikMui from '@formulaik-community/formulaik-mui-react'
//import FormulaikSpecific from 'components/shared/formulaik'
import * as Yup from 'yup'

import fetchItems from './fetcher'

export default (props) => {
  const {
    value,
    onValueChanged,
    error,
    item: { label, params = {} }
  } = props

  const { include = [],
    exclude = [],
    multiple = true,
    locale,
    queryHook,
    optionLabel,
    queryInitiator,
    className, } = params

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
        className,
        filterSelectedOptions: true,
        fetcher: async ({ value }) => {
          return fetchItems({ search: value, className, include, exclude, queryHook, queryInitiator, data, locale, cache: props.cache })
        },
        isOptionEqualToValue: (option, value) => (option.id === value.id),
        getOptionLabel: optionLabel,
      }
    },
  ]

  const initialValues = {
    items: data
  }

  const onValuesChanged = (__values) => {
    onValueChanged && onValueChanged(__values.items)
  }

  return <div className={`w-full ${error ? 'bg-red-100 ' : ''}`}>
    <Formulaik
      componentsLibraries={[FormulaikMui]}
      initialValues={initialValues}
      validationSchema={validationSchema}
      inputs={inputs}
      onValuesChanged={onValuesChanged}
      hideErrors
      disabled={props.disabled}
      readOnly={props.readOnly}
    />
  </div>
}
