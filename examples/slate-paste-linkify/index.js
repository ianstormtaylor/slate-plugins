
import PasteLinkify from 'slate-paste-linkify'
import React from 'react'
import initialValue from './value.json'
import { Editor } from 'slate-react'
import { Value } from 'slate'

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {

  plugins = [
    PasteLinkify({
      type: 'link',
      hrefProperty: 'url',
      collapseTo: 'end'
    })
  ]

  state = {
    value: Value.fromJSON(initialValue)
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render = () => {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode = (props) => {
    const { node, attributes, children } = props
    switch (node.type) {
      case 'link':
        return <a {...attributes} href={node.data.get('url')}>{children}</a>
    }
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
