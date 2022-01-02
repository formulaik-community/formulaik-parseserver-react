import React from 'react'

export default (props) => {
  const { item: { label, id, props: itemProps } } = props
  return <div className={`divider ${itemProps.vertical ? 'divider-vertical' : ''} `}>{itemProps.content}</div>
}