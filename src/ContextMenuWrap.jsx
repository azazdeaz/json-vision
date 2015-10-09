import React from 'react'
import {ContextMenu} from 'react-matterkit'

export default class ContextMenuWrap extends React.Component {
  render() {
    const {options, children, leaf} = this.props

    if (!options) {
      return children
    }

    const items = options.items && options.items.map(item => {
      if (item.onClick) {
        const originalClickHandler = item.onClick
        item = {
          ...item,
          onClick: () => originalClickHandler(leaf.connect)
        }
      }
      return item
    })

    return <ContextMenu
      items = {items || []}
      renderComponent = {options.renderComponent}>
      {children}
    </ContextMenu>
  }
}
