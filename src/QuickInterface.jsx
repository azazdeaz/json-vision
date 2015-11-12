import React, { PropTypes } from 'react'
import Item from './Item'

class QuickInterface extends React.Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  }

  render () {
    const {settings, children} = this.props
    return <Item settings={settings}>
        {children}
      </Item>
  }
}

export default QuickInterface
