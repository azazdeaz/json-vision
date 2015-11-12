import React, { PropTypes } from 'react'
import Item from './Item'

class QuickInterface extends React.Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.settings !== this.props.settings
  }

  render () {
    const {settings, children} = this.props
    return <Item settings={settings}>
      {JSON.stringify({children})}
        {children}
      </Item>
  }
}

export default QuickInterface
