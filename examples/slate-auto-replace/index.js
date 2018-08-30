
import AutoReplace from 'slate-auto-replace'
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
    AutoReplace({
      trigger: ')',
      before: /(\(c)$/i,
      change: change => change.insertText('©'),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(>)$/,
      change: change => change.setBlocks('blockquote'),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      change: change => change.setBlocks('li').wrapBlock('ul'),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(#{1,6})$/,
      change: (change, event, matches) => {
        const [ hashes ] = matches.before
        const level = hashes.length
        change.setBlocks({ type: 'h', data: { level }})
      }
    }),
    AutoReplace({
      trigger: 'enter',
      before: /^(-{3})$/,
      change: change => change.setBlocks({ type: 'hr', isVoid: true }),
    })
  ]

  state = {
    value: Value.fromJSON(initialValue),
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
      case 'blockquote':
        return <blockquote {...attributes}><p>{children}</p></blockquote>
      case 'hr':
        return <hr />
      case 'ul':
        return <ul {...attributes}>{children}</ul>
      case 'li':
        return <li {...attributes}>{children}</li>
      case 'h':
        const level = node.data.get('level')
        const Tag = `h${level}`
        return <Tag {...attributes}>{children}</Tag>
    }
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example
