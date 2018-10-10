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
  plugins = [PasteLinkify()]

  commands = {
    wrapLink(change, url) {
      change.wrapInline({ type: 'link', data: { url } })
    },
    unwrapLink(change) {
      change.unwrapInline('link')
    },
  }

  queries = {
    isLinkActive(editor, value) {
      const { inlines } = value
      const active = inlines.some(i => i.type === 'link')
      return active
    },
  }

  state = {
    value: Value.fromJSON(initialValue),
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        commands={this.commands}
        queries={this.queries}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode(props, next) {
    const { node, attributes, children } = props
    switch (node.type) {
      case 'link':
        return (
          <a {...attributes} href={node.data.get('url')}>
            {children}
          </a>
        )
      default:
        return next()
    }
  }
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
