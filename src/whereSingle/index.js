import React, { useState } from 'react'
import Formulaik from '@formulaik-community/formulaik-engine-react'
import FormulaikMui from '@formulaik-community/formulaik-mui-react'
import * as Yup from 'yup'

export default (props) => {
  const {
    values,
    onValueChanged,
    errors,
    item: { id, params }
  } = props

  const [error, setError] = useState(null)
  const item = values[id]
  const { fields } = params

  const validationSchema = () => {
    return Yup.object().shape({
      fieldName: Yup.string()
        .required("This field can't be blank"),
      constraint: Yup.string()
        .required("This field can't be blank"),
      value: Yup.string()
        .required("This field can't be blank"),
    })
  }

  const fieldNameOptions = () => {
    const items = [{ label: '', value: null }]
    Object.keys(fields).forEach(key => {
      if (['ACL'].includes(key)) {
        return
      }
      const _item = { label: key, value: key }
      items.push(_item)
    })
    return items
  }

  const inputTypeFromFieldType = (data) => {
    if (!data) {
      return {
        type: 'input',
      }
    }

    const { type } = data
    switch (type) {
      default:
      case 'String':
        return {
          type: 'input',
        }
      case 'Date':
        return {
          type: 'datePicker',
        }
    }
  }
  const inputs = [
    {
      isMulti: true,
      className: 'flex',
      items: [
        {
          type: 'select',
          schema: 'fieldName',
          id: 'fieldName',
          label: 'Field name',
          className: 'w-1/3 ml-2 mr-2',
          params: {
            options: fieldNameOptions()
          }
        },
        {
          type: 'select',
          schema: 'constraint',
          id: 'constraint',
          label: 'Constraint',
          className: 'w-1/3 ml-2 mr-2',
          params: {
            options: [
              { label: "equalTo", value: 'equalTo' },
              // { label: "notEqualTo", value: 'notEqualTo' },
              { label: "greaterThan", value: 'greaterThan' },
              // { label: "greaterThanOrEqualTo", value: 'greaterThanOrEqualTo' },
              // { label: "lessThan", value: 'lessThan' },
              // { label: "lessThanOrEqualTo", value: 'lessThanOrEqualTo' },
              // { label: "containedIn", value: 'containedIn' },
              // { label: "notContainedIn", value: 'notContainedIn' },
              { label: "exists", value: 'exists' },
              { label: "doesNotExist", value: 'doesNotExist' },
            ]
          }
        },
        {
          ...(inputTypeFromFieldType(item)),
          schema: 'value',
          id: 'value',
          label: 'Value',
          className: 'w-1/3 ml-2',
        }
      ]
    },

  ]


  const initialValues = item ? item : {}

  const onValuesChanged = (__values) => {
    const result = { ...item, ...__values }
    if (__values.fieldName) {
      const struct = fields[__values.fieldName]
      if (struct) {
        result.type = struct.type
      }
    }
    onValueChanged && onValueChanged(result)
  }

  const handleRemove = () => {
    if (params && params.handleRemove) {
      params.handleRemove({ id })
    }

  }

  return <Formulaik
    componentsLibraries={[FormulaikMui]}
    initialValues={initialValues}
    validationSchema={validationSchema}
    inputs={inputs}
    onValuesChanged={onValuesChanged}
    error={error} />
}
