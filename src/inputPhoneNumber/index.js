import React from 'react'
import PhoneInput from 'react-phone-number-input'
//import 'react-phone-number-input/style.css'

export default (props) => {
  const { setFieldTouched, setFieldValue, field, values, errors, item: { label, id, props: itemProps } } = props

  return <div className="border-2 border-warmGray-300 rounded-md px-4 py-4">
    <PhoneInput
      placeholder="Enter phone number"
      value={values[id]}
      onChange={(value) => {
        setFieldValue(id, value)
        setFieldTouched(id, true, false)
      }}
      {...itemProps}
      //inputComponent={(args) => <CustomInput {...props} />}
      className={`w-full focus:ring-primary  ${errors[id] ? 'bg-red-100 select-error' : ''}`}
    />
  </div>
}
