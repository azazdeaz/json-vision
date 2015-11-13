import React from 'react'
import Item from './Item'

const QuickInterface = ({children, ...rest}) => {
  return <Item {...rest}>
    {children}
  </Item>
}

export default QuickInterface
