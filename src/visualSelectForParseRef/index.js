import React, { useState, useEffect } from 'react'
import Formulaik from '@yelounak/formulaik'
import FormulaikMui from '@yelounak/formulaik-mui'
import * as Yup from 'yup'

import fetchRefs from './fetchRefs'

export default (props) => {
  const {
    value,
    customOnValueChanged,
    item: { label, props: itemProps }
  } = props

  const [refs, setRefs] = useState(null)
  var items = value ? value : []

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const { include, exclude, queryHook, className, search } = itemProps.fetchParameters
      const _refs = await fetchRefs({ search, className, include, exclude, queryHook })
      setRefs(_refs)
    } catch (e) {

    }
  }

  if (!refs) {
    return <div className='
    align-middle
    text-center
    py-4'>
      <h4>Loading</h4>
    </div>
  }

  if (Array.isArray(items)) {
    items = items.filter(a => a)
  }

  const validationSchema = () => {
    return Yup.object().shape({
      items: Yup.array()
        .min(itemProps.visualSelectProps.minSelectionAllowed, itemProps.visualSelectProps.minSelectionAllowedMessage)
        .max(itemProps.visualSelectProps.maxSelectionAllowed, itemProps.visualSelectProps.maxSelectionAllowedMessage)
    })
  }

  const visualSelectItems = () => {
    return refs.map(ref => ({
      id: ref.id,
      props: itemProps.mapRefProps(ref)
    }))
  }

  const inputs = [
    {
      type: 'visualSelect',
      schema: 'items',
      label,
      id: 'items',
      props: {
        items: visualSelectItems(),
        ...itemProps.visualSelectProps
      }
    },
  ]

  const initialValues = {
    items: items.map(i => i.id)
  }

  const onValuesChanged = (__values) => {
    const values = refs.filter(a => __values.items.includes(a.id))
    console.log('values', values)
    customOnValueChanged && customOnValueChanged(values)
  }

  // const customFormulaikLibrary = (props) => {
  //   switch (props.type) {
  //     case 'visualSelect':
  //       return VisualSelect
  //     default: return null
  //   }
  // }

  return <Formulaik
    componentsLibraries={[FormulaikMui,]}
    initialValues={initialValues}
    validationSchema={validationSchema}
    inputs={inputs}
    onValuesChanged={onValuesChanged}
    disabled={props.disabled}
    readOnly={props.readOnly} />
}
