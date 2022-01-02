import React from 'react'

export default (props) => {
  const { isSubmitting, item: { value } } = props

  return <div className={`flex justify-center mt-4`}>
    <button
      className={`btn btn-outline btn-lg w-60  ${isSubmitting ? 'loading' : ''}`}
      type="submit"
      disabled={isSubmitting}>
      {isSubmitting ? '' : value}
    </button>
  </div>
}