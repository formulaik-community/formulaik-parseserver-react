import React, { useState, useEffect } from 'react'
import Formulaik from '@formulaik-community/formulaik-engine-react'
import WhereComponent from '../whereSingle'
import FormulaikMui from '@formulaik-community/formulaik-mui-react'
import * as Yup from 'yup'
import CircularProgress from '@mui/material/CircularProgress'
import _ from 'underscore'
import shortid from 'shortid'

export default (props) => {
  const {
    values,
    onValueChanged,
    item: { id, params }
  } = props

  const _value = values[id]
  if (!_value || _.isEmpty(_value)) {
    const _placeHolder = { id: shortid.generate() }
    const val = {}
    val[_placeHolder.id] = _placeHolder
    onValueChanged && onValueChanged(val)
    return <div className="w-full border-warmGray-400 border-2 px-5 py-6 rounded-xl">
      <div className="w-full justify-center flex">
        <CircularProgress />
      </div>
    </div>
  }

  useEffect(() => {
    updateValues({ values: values[id], force: false })
  }, [])


  const [error, setError] = useState(null)
  const { schema } = params

  const validationSchema = () => {
    return Yup.object().shape()
  }

  const handleRemove = ({ id: _id }) => {
    if (!_id || !values || !values[id]) {
      return
    }
    const _value = values[id]

    if (!_value || !_value[_id]) {
      return
    }
    const __value = { ..._value }
    delete __value[_id]
    updateValues({ values: __value })
  }

  const inputs = () => {
    const { fields } = schema
    const items = wheresToArray()
    return items.map((item, i) => ({
      type: 'where',
      id: item.id,
      params: {
        fields,
        handleRemove
      }
    }))
  }


  const initialValues = () => {
    const items = wheresToArray()
    const _items = {}
    const _value = values[id]
    const ids = items.map(item => item.id)
    for (var i = 0; i < ids.length; i++) {
      const _id = ids[i]
      const val = _value[_id]
      _items[_id] = { id: _id, ...(val ? val : {}) }
    }

    return _items
  }



  const wheresToArray = () => {

    const _value = values[id]

    return _.map(_value, (value, key) => {

      const _v = {
        ...value,
      }
      if (!_v.id) {
        _v.id = key
      }
      return _v
    })
  }

  const onValuesChanged = (_values) => {

    updateValues({ values: _values })
  }

  const updateValues = ({ values: _values, force = true }) => {
    const _placeHolder = { id: shortid.generate() }

    var placeholderExists = _.findWhere(_.values(_values), { fieldName: undefined })
    if (!placeholderExists) {
      placeholderExists = _.findWhere(_.values(_values), { fieldName: null })
    }

    if (!placeholderExists) {
      _values[_placeHolder.id] = _placeHolder
    }

    if (placeholderExists && !force) {
      return
    }
    onValueChanged && onValueChanged(_values)
  }

  const componentsLibrary = ({ type }) => {
    switch (type) {
      case 'where':
        return WhereComponent
      default:
        return null
    }
  }

  // const handleAdd = () => {

  // }

  return <div className="w-full">
    <Formulaik
      componentsLibraries={[componentsLibrary, FormulaikMui]}
      initialValues={initialValues}
      validationSchema={validationSchema}
      inputs={inputs}
      onValuesChanged={onValuesChanged}
      error={error} />
    {/* <div className="grid grid-cols-2 justify-between ">
            <div className="">
                <Button onClick={handleAdd} className={'mr-4'}>Add</Button>
            </div>
            <div className="flex justify-end mr-4">

            </div>
        </div> */}
  </div>
}
