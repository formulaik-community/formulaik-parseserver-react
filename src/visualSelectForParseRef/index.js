import React, { useState, useEffect } from 'react'
import Formulaik from '@yelounak/formulaik'
import FormulaikMui from '@yelounak/formulaik-mui'
import * as Yup from 'yup'

import fetchRefs from './fetchRefs'

export default (props) => {
  const {
    values,
    customOnValueChanged,
    errors,
    item: { label, id, props: itemProps }
  } = props
  const [refs, setRefs] = useState(null)
  const [error, setError] = useState(null)

  var items = values[id] ? values[id] : []


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
    return <div></div>
  }

  if (Array.isArray(items)) {
    items = items.filter(a => a)
  }

  const validationSchema = () => {
    return Yup.object().shape({
      items: Yup.array()
    })
  }

  const visualSelectItems = () => {
    return refs.map(ref => ({
      id: ref.id,
      props: itemProps.mapRefProps(ref)
    }))
  }

  const formItemsProvider = [
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

  return <Formulaik
    componentsLibraries={[FormulaikMui]}
    initialValues={initialValues}
    validationSchema={validationSchema}
    formItemsProvider={formItemsProvider}
    onValuesChanged={onValuesChanged}
    error={error} />
}